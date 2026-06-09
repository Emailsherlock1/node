import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Emailsherlock,
  AuthenticationError,
  InsufficientCreditsError,
  RateLimitError,
  isVerifyResult,
} from '../dist/index.js';

function stubFetch(status, body, headers = {}) {
  return async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
}

test('verify.single returns the result object and captures credits', async () => {
  const es = new Emailsherlock('test-key', {
    fetch: stubFetch(
      200,
      { email: 'jane@acme.com', result: 'valid', mx: true, disposable: false, role: false, catch_all: false, score: 0.95, freshness: 'fresh' },
      { 'X-Credits-Remaining': '41', 'X-RateLimit-Limit': '60', 'X-RateLimit-Remaining': '59', 'X-RateLimit-Reset': '1700000000' },
    ),
  });

  const result = await es.verify.single({ email: 'jane@acme.com' });
  assert.equal(result.result, 'valid');
  assert.equal(result.score, 0.95);
  assert.equal(es.creditsRemaining, 41);
  assert.equal(es.rateLimit.limit, 60);
});

test('verify.single surfaces the v2 fields when the API sends them', async () => {
  const es = new Emailsherlock('test-key', {
    fetch: stubFetch(200, {
      email: 'jane@acme.com',
      result: 'valid',
      mx: true,
      disposable: false,
      role: false,
      catch_all: false,
      score: 0.95,
      freshness: 'fresh',
      deliverable: true,
      reason: 'mailbox_accepts',
      mx_record: 'mx1.acme.com',
      free_email: false,
      checked_at: '2026-06-09T12:00:00Z',
      domain: {
        name: 'acme.com',
        types: ['company'],
        score: 87,
        spf: true,
        dkim: true,
        dmarc: true,
        dmarc_policy: 'reject',
        mta_sts: false,
        tls_rpt: false,
        bimi: false,
        dane: false,
        blacklists: 0,
        dnssec: 'secure',
        caa: true,
      },
    }),
  });

  const result = await es.verify.single({ email: 'jane@acme.com' });
  assert.equal(result.deliverable, true);
  assert.equal(result.reason, 'mailbox_accepts');
  assert.equal(result.mx_record, 'mx1.acme.com');
  assert.equal(result.free_email, false);
  assert.equal(result.checked_at, '2026-06-09T12:00:00Z');
  assert.equal(result.domain.name, 'acme.com');
  assert.deepEqual(result.domain.types, ['company']);
  assert.equal(result.domain.dmarc_policy, 'reject');
  assert.equal(result.domain.dnssec, 'secure');
});

test('verify.single tolerates responses without the v2 fields', async () => {
  const es = new Emailsherlock('test-key', {
    fetch: stubFetch(200, {
      email: 'jane@acme.com',
      result: 'unknown',
      mx: true,
      disposable: false,
      role: false,
      catch_all: false,
      score: null,
      freshness: 'fresh',
    }),
  });

  const result = await es.verify.single({ email: 'jane@acme.com' });
  assert.equal(result.result, 'unknown');
  assert.equal(result.score, null);
  assert.equal(result.deliverable, undefined);
  assert.equal(result.domain, undefined);
});

test('verify.batch returns results and the type guard splits them', async () => {
  const es = new Emailsherlock({
    apiKey: 'k',
    fetch: stubFetch(200, {
      results: [
        { email: 'jane@acme.com', result: 'valid', mx: true, disposable: false, role: false, catch_all: false, score: 0.95, freshness: 'fresh' },
        { email: 'nope@', error: 'invalid_email' },
      ],
    }),
  });

  const { results } = await es.verify.batch({ emails: ['jane@acme.com', 'nope@'] });
  assert.equal(results.length, 2);
  assert.ok(isVerifyResult(results[0]));
  assert.ok(!isVerifyResult(results[1]));
});

test('401 throws AuthenticationError', async () => {
  const es = new Emailsherlock('bad', {
    fetch: stubFetch(401, { error: { code: 'unauthorized', message: 'Invalid API key.' } }),
  });
  await assert.rejects(() => es.verify.single({ email: 'a@b.com' }), (e) => {
    assert.ok(e instanceof AuthenticationError);
    assert.equal(e.status, 401);
    assert.equal(e.code, 'unauthorized');
    return true;
  });
});

test('402 carries credit headers', async () => {
  const es = new Emailsherlock('k', {
    fetch: stubFetch(402, { error: { code: 'insufficient_credits', message: 'Not enough credits.' } }, { 'X-Credits-Required': '1', 'X-Credits-Remaining': '0' }),
  });
  await assert.rejects(() => es.verify.single({ email: 'a@b.com' }), (e) => {
    assert.ok(e instanceof InsufficientCreditsError);
    assert.equal(e.creditsRequired, 1);
    assert.equal(e.creditsRemaining, 0);
    return true;
  });
});

test('429 carries retry-after', async () => {
  const es = new Emailsherlock('k', {
    fetch: stubFetch(429, { error: { code: 'rate_limit_exceeded', message: 'Rate limit exceeded.' } }, { 'Retry-After': '30', 'X-RateLimit-Limit': '60' }),
  });
  await assert.rejects(() => es.verify.single({ email: 'a@b.com' }), (e) => {
    assert.ok(e instanceof RateLimitError);
    assert.equal(e.retryAfter, 30);
    return true;
  });
});

test('missing key throws at construction', () => {
  const saved = process.env.ES_KEY;
  delete process.env.ES_KEY;
  assert.throws(() => new Emailsherlock());
  if (saved !== undefined) process.env.ES_KEY = saved;
});
