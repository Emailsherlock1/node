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

test('credits() reads the account status', async () => {
  const es = new Emailsherlock('k', {
    fetch: stubFetch(200, {
      credits: { total: 1240, purchased: 1000, gifted: 240 },
      rate_limit: { limit: 60, remaining: 59, reset: 1700000000 },
      plan: 'Free',
      sandbox: false,
    }),
  });
  const status = await es.credits();
  assert.equal(status.credits.total, 1240);
  assert.equal(status.sandbox, false);
});

test('verify.submitJob returns a processing job', async () => {
  const es = new Emailsherlock('k', {
    fetch: stubFetch(202, {
      id: 'job-1',
      status: 'processing',
      total: 2,
      progress: { total: 2, done: 0 },
      created_at: '2026-06-10T14:32:00+00:00',
      expires_at: '2026-06-17T14:32:00+00:00',
    }),
  });
  const job = await es.verify.submitJob({ emails: ['a@b.com', 'c@d.com'] });
  assert.equal(job.id, 'job-1');
  assert.equal(job.status, 'processing');
});

test('guard.recordEvents posts the events array', async () => {
  let captured;
  const es = new Emailsherlock('k', {
    fetch: async (_url, init) => {
      captured = JSON.parse(init.body);
      return new Response(null, { status: 202 });
    },
  });
  await es.guard.recordEvents([
    { verdict: 'disposable', action: 'deny', reasons: ['disposable_provider'], degraded: false, source: 'local' },
  ]);
  assert.equal(captured.events.length, 1);
  assert.equal(captured.events[0].verdict, 'disposable');
});

test('missing key throws at construction', () => {
  const saved = process.env.ES_KEY;
  delete process.env.ES_KEY;
  assert.throws(() => new Emailsherlock());
  if (saved !== undefined) process.env.ES_KEY = saved;
});
