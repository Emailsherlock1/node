import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Emailsherlock,
  EmailsherlockError,
  AuthenticationError,
  ForbiddenError,
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

const VALID = { email: 'jane@acme.com', result: 'valid', mx: true, disposable: false, role: false, catch_all: false };

test('reads both balances from their current headers (EM-4987)', async () => {
  // The alias X-Credits-Remaining carries another value on purpose, so the test
  // fails if the client still reads the alias first.
  const es = new Emailsherlock('k', {
    fetch: stubFetch(200, VALID, {
      'X-Probe-Credits-Remaining': '41',
      'X-Credits-Remaining': '7',
      'X-Validations-Remaining': '950',
      'X-Verify-Free-Remaining': '3',
    }),
  });
  await es.verify.single({ email: 'jane@acme.com' });
  assert.equal(es.probeCreditsRemaining, 41);
  assert.equal(es.validationsRemaining, 950);
  assert.equal(es.creditsRemaining, 41);
});

test('falls back to the legacy balance headers', async () => {
  const es = new Emailsherlock('k', {
    fetch: stubFetch(200, VALID, { 'X-Credits-Remaining': '12', 'X-Verify-Free-Remaining': '30' }),
  });
  await es.verify.single({ email: 'jane@acme.com' });
  assert.equal(es.probeCreditsRemaining, 12);
  assert.equal(es.validationsRemaining, 30);
  assert.equal(es.creditsRemaining, 12);
});

test('validationsRemaining stays null when the plan is unlimited', async () => {
  const es = new Emailsherlock('k', { fetch: stubFetch(200, VALID, { 'X-Probe-Credits-Remaining': '41' }) });
  await es.verify.single({ email: 'jane@acme.com' });
  assert.equal(es.validationsRemaining, null);
  assert.equal(es.probeCreditsRemaining, 41);
});

test('402 prefers X-Probe-Credits-Remaining', async () => {
  const es = new Emailsherlock('k', {
    fetch: stubFetch(402, { error: { code: 'insufficient_credits', message: 'Not enough credits.' } }, { 'X-Probe-Credits-Remaining': '2', 'X-Credits-Remaining': '9' }),
  });
  await assert.rejects(() => es.verify.single({ email: 'a@b.com' }), (e) => {
    assert.ok(e instanceof InsufficientCreditsError);
    assert.equal(e.creditsRemaining, 2);
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

test('snake_case wire fields survive on single + batch results (no camelCase rename)', async () => {
  // Regression guard (EM-951): the generated models keep the wire property
  // names (modelPropertyNaming: original). A camelCase rename would make the
  // types declare catchAll/mxRecord while the runtime object stays snake_case.
  const wire = {
    email: 'jane@acme.com', result: 'valid', mx: true, mx_record: 'mx1.acme.com',
    disposable: false, role: false, catch_all: true, free_email: false,
    score: 0.95, freshness: 'fresh', checked_at: '2026-06-09T14:32:00+00:00',
    decision: { recommendation: 'allow', reasons: ['mailbox_accepts'] },
  };

  const single = await new Emailsherlock('k', { fetch: stubFetch(200, wire) })
    .verify.single({ email: 'jane@acme.com' });
  assert.equal(single.catch_all, true);
  assert.equal(single.mx_record, 'mx1.acme.com');
  assert.equal(single.free_email, false);
  assert.equal(single.checked_at, '2026-06-09T14:32:00+00:00');
  assert.equal(single.catchAll, undefined); // proves no camelCase alias

  const { results } = await new Emailsherlock('k', { fetch: stubFetch(200, { results: [wire] }) })
    .verify.batch({ emails: ['jane@acme.com'] });
  assert.equal(results[0].catch_all, true);
  assert.equal(results[0].mx_record, 'mx1.acme.com');
});

test('missing key throws at construction', () => {
  const saved = process.env.ES_KEY;
  delete process.env.ES_KEY;
  assert.throws(() => new Emailsherlock());
  if (saved !== undefined) process.env.ES_KEY = saved;
});

function recordingFetch() {
  const seen = [];
  const fn = async (input, init) => {
    const req = new Request(input, init);
    seen.push(req.headers);
    return new Response(JSON.stringify({ credits: {}, rateLimit: {} }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  return { fn, seen };
}

test('clientId sends X-Client-Id on every request', async () => {
  const { fn, seen } = recordingFetch();
  const es = new Emailsherlock({ apiKey: 'k', fetch: fn, clientId: 42 });
  assert.equal(es.clientId, 42);
  await es.credits();
  assert.equal(seen[0].get('X-Client-Id'), '42');
});

test('X-Client-Id is absent when clientId is unset', async () => {
  const { fn, seen } = recordingFetch();
  const es = new Emailsherlock({ apiKey: 'k', fetch: fn });
  assert.equal(es.clientId, undefined);
  await es.credits();
  assert.equal(seen[0].has('X-Client-Id'), false);
});

test('withClientId returns a new client and leaves the original unchanged', async () => {
  const { fn, seen } = recordingFetch();
  const base = new Emailsherlock({ apiKey: 'k', fetch: fn });
  const tenant = base.withClientId(7);
  assert.notEqual(tenant, base);
  assert.equal(tenant.clientId, 7);
  assert.equal(base.clientId, undefined);
  await tenant.credits();
  await base.credits();
  assert.equal(seen[0].get('X-Client-Id'), '7');
  assert.equal(seen[1].has('X-Client-Id'), false);
});

test('invalid clientId values throw config_error', () => {
  for (const bad of [0, -1, 1.5, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(
      () => new Emailsherlock({ apiKey: 'k', clientId: bad }),
      (err) => err.code === 'config_error',
    );
  }
  assert.throws(() => new Emailsherlock('k').withClientId(0), (err) => err.code === 'config_error');
});

test('client_not_found and forbidden keep the server code', async () => {
  const nf = new Emailsherlock({
    apiKey: 'k',
    clientId: 9,
    fetch: stubFetch(404, { error: { code: 'client_not_found', message: 'nope' } }),
  });
  await assert.rejects(nf.credits(), (e) => e.status === 404 && e.code === 'client_not_found');
  const fb = new Emailsherlock({
    apiKey: 'k',
    clientId: 9,
    fetch: stubFetch(403, { error: { code: 'forbidden', message: 'blocked' } }),
  });
  await assert.rejects(fb.credits(), (e) => e.status === 403 && e.code === 'forbidden');
});

// --- 0.4.0 endpoint groups -------------------------------------------------

function captureFetch(status, body, headers = {}) {
  const calls = [];
  const fn = async (input, init) => {
    const req = new Request(input, init);
    const text = await req.text();
    calls.push({
      method: req.method,
      url: new URL(req.url),
      headers: req.headers,
      body: text === '' ? undefined : JSON.parse(text),
    });
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  };
  return { fn, calls };
}

function clientWith(status, body, headers) {
  const cap = captureFetch(status, body, headers);
  return { es: new Emailsherlock({ apiKey: 'k', fetch: cap.fn }), calls: cap.calls };
}

// An IDN domain, so the tests see the path segment percent-encoded.
const IDN = 'bücher.de';
const IDN_PATH = 'b%C3%BCcher.de';

test('deliverability.listAddresses GETs the address list', async () => {
  const { es, calls } = clientWith(200, {
    addresses: [{ id: 5, label: 'Seed', address: 'seed@check.example', active: true, has_webhook: false, latest_verdict: null, created_at: '2026-11-01T00:00:00+00:00' }],
  });
  const res = await es.deliverability.listAddresses();
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, '/v1/deliverability/addresses');
  assert.equal(calls[0].url.search, '');
  assert.equal(res.addresses[0].id, 5);
});

test('deliverability.latest GETs the latest verdict', async () => {
  const { es, calls } = clientWith(200, { address_id: 5, has_result: false, verdict: null });
  const res = await es.deliverability.latest(5);
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, '/v1/deliverability/addresses/5/latest');
  assert.equal(res.has_result, false);
});

test('deliverability.listChecks sends only the paging the caller set', async () => {
  const { es, calls } = clientWith(200, { address_id: 5, limit: 10, offset: 0, count: 0, checks: [] });
  const res = await es.deliverability.listChecks(5, { limit: 10 });
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, '/v1/deliverability/addresses/5/checks');
  assert.equal(calls[0].url.search, '?limit=10');
  assert.equal(res.limit, 10);

  await es.deliverability.listChecks(5);
  assert.equal(calls[1].url.search, '');
});

test('deliverability.getCheck GETs one check', async () => {
  const { es, calls } = clientWith(200, { id: 77, address_id: 5, result: { score: 9 } });
  const res = await es.deliverability.getCheck(77);
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, '/v1/deliverability/checks/77');
  assert.equal(res.id, 77);
});

test('deliverability.setWebhook PUTs the url and returns the secret', async () => {
  const { es, calls } = clientWith(200, { address_id: 5, webhook: { url: 'https://hooks.example.com/x', secret: 'whsec_1' } });
  const res = await es.deliverability.setWebhook(5, { url: 'https://hooks.example.com/x' });
  assert.equal(calls[0].method, 'PUT');
  assert.equal(calls[0].url.pathname, '/v1/deliverability/addresses/5/webhook');
  assert.equal(calls[0].headers.get('Content-Type'), 'application/json');
  assert.deepEqual(calls[0].body, { url: 'https://hooks.example.com/x' });
  assert.equal(res.webhook.secret, 'whsec_1');
});

test('deliverability.deleteWebhook DELETEs the webhook', async () => {
  const { es, calls } = clientWith(200, { address_id: 5, webhook: null });
  const res = await es.deliverability.deleteWebhook(5);
  assert.equal(calls[0].method, 'DELETE');
  assert.equal(calls[0].url.pathname, '/v1/deliverability/addresses/5/webhook');
  assert.equal(calls[0].body, undefined);
  assert.equal(res.webhook, null);
});

const SETUP = {
  domain: IDN,
  status: 'not_found',
  confirmed: false,
  record: null,
  dns_provider: null,
  watch_slots: { used: 1, limit: 3 },
};

test('dmarc.start POSTs to the domain setup path', async () => {
  const { es, calls } = clientWith(200, SETUP);
  const res = await es.dmarc.start(IDN);
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].url.pathname, `/v1/domains/${IDN_PATH}/dmarc`);
  assert.equal(res.status, 'not_found');
});

test('dmarc.check POSTs to the check path', async () => {
  const { es, calls } = clientWith(200, { ...SETUP, status: 'ok', confirmed: true });
  const res = await es.dmarc.check(IDN);
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].url.pathname, `/v1/domains/${IDN_PATH}/dmarc/check`);
  assert.equal(res.confirmed, true);
});

test('dmarc.summary sends range', async () => {
  const { es, calls } = clientWith(200, { domain: IDN, range_days: 7, message_count: 120, aligned_messages: 100, source_count: 3, known_source_count: 2, unknown_source_count: 1, new_source_count: 0, failing_source_count: 1 });
  const res = await es.dmarc.summary(IDN, { range: 7 });
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, `/v1/dmarc/${IDN_PATH}/summary`);
  assert.equal(calls[0].url.search, '?range=7');
  assert.equal(res.message_count, 120);
});

test('dmarc.reports sends the filters and paging', async () => {
  const { es, calls } = clientWith(200, { domain: IDN, limit: 20, offset: 40, count: 0, next_offset: null, reports: [] });
  const res = await es.dmarc.reports(IDN, { from: '2026-11-01', to: '2026-11-20', reporter: 'google.com', limit: 20, offset: 40 });
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, `/v1/dmarc/${IDN_PATH}/reports`);
  assert.deepEqual(Object.fromEntries(calls[0].url.searchParams), {
    from: '2026-11-01', to: '2026-11-20', reporter: 'google.com', limit: '20', offset: '40',
  });
  assert.equal(res.offset, 40);
});

test('dmarc.sources sends range, result, check and paging', async () => {
  const { es, calls } = clientWith(200, { domain: IDN, range_days: 30, limit: 5, offset: 0, count: 0, next_offset: null, sources: [] });
  const res = await es.dmarc.sources(IDN, { range: 30, result: 'fail', check: 'spf', limit: 5, offset: 0 });
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, `/v1/dmarc/${IDN_PATH}/sources`);
  assert.deepEqual(Object.fromEntries(calls[0].url.searchParams), {
    range: '30', result: 'fail', check: 'spf', limit: '5', offset: '0',
  });
  assert.deepEqual(res.sources, []);
});

test('tlsRpt.reports sends range and paging', async () => {
  const { es, calls } = clientWith(200, { domain: IDN, range_days: 7, limit: 10, offset: 10, count: 0, next_offset: null, reports: [] });
  const res = await es.tlsRpt.reports(IDN, { range: 7, limit: 10, offset: 10 });
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, `/v1/tls-rpt/${IDN_PATH}/reports`);
  assert.deepEqual(Object.fromEntries(calls[0].url.searchParams), { range: '7', limit: '10', offset: '10' });
  assert.equal(res.range_days, 7);
});

test('domains.changes sends paging', async () => {
  const { es, calls } = clientWith(200, { domain: IDN, limit: 25, offset: 0, count: 0, next_offset: null, changes: [] });
  const res = await es.domains.changes(IDN, { limit: 25 });
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, `/v1/domains/${IDN_PATH}/changes`);
  assert.equal(calls[0].url.search, '?limit=25');
  assert.equal(res.limit, 25);
});

test('domains.nextSteps GETs the next steps', async () => {
  const { es, calls } = clientWith(200, { domain: IDN, policy: { tag: 'p', value: 'none' }, ladder: null, unaligned_sources: [], findings: [] });
  const res = await es.domains.nextSteps(IDN);
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].url.pathname, `/v1/domains/${IDN_PATH}/next-steps`);
  assert.equal(calls[0].url.search, '');
  assert.equal(res.policy.value, 'none');
});

test('impersonation.analyze POSTs the body with the wire field "protected"', async () => {
  const { es, calls } = clientWith(
    200,
    { risk: 'high', score: 70, identity: 'Jane Doe', reasons: [{ reason: 'display_name', weight: 40, detail: 'Jane Doe' }] },
    { 'X-Credits-Remaining': '99' },
  );
  const request = {
    from: 'jane.doe@gmail.com',
    display_name: 'Jane Doe',
    protected: [{ name: 'Jane Doe', domains: ['acme.com'] }],
  };
  const res = await es.impersonation.analyze(request);
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].url.pathname, '/v1/impersonation/analyze');
  assert.deepEqual(calls[0].body, request);
  assert.equal(calls[0].body._protected, undefined);
  assert.equal(res.risk, 'high');
  assert.equal(res.reasons[0].reason, 'display_name');
  assert.equal(es.creditsRemaining, 99);
});

test('402 on impersonation.analyze throws InsufficientCreditsError', async () => {
  const { es } = clientWith(
    402,
    { error: { code: 'insufficient_credits', message: 'Not enough credits.' } },
    { 'X-Credits-Required': '1', 'X-Credits-Remaining': '0' },
  );
  await assert.rejects(
    () => es.impersonation.analyze({ from: 'a@b.com', protected: [{ name: 'Jane' }] }),
    (e) => {
      assert.ok(e instanceof InsufficientCreditsError);
      assert.equal(e.status, 402);
      assert.equal(e.creditsRequired, 1);
      assert.equal(e.creditsRemaining, 0);
      return true;
    },
  );
});

test('403 on a dmarc read throws ForbiddenError with the server code', async () => {
  const { es } = clientWith(403, { error: { code: 'forbidden', message: 'No report address in the DMARC record.' } });
  await assert.rejects(() => es.dmarc.summary(IDN), (e) => {
    assert.ok(e instanceof ForbiddenError);
    assert.equal(e.status, 403);
    assert.equal(e.code, 'forbidden');
    return true;
  });
});

test('409 on dmarc.start falls through to the base EmailsherlockError', async () => {
  const { es } = clientWith(409, { error: { code: 'watch_limit_reached', message: 'Plan limit reached.' } });
  await assert.rejects(() => es.dmarc.start(IDN), (e) => {
    assert.equal(e.constructor, EmailsherlockError);
    assert.equal(e.status, 409);
    assert.equal(e.code, 'watch_limit_reached');
    return true;
  });
});

test('rate-limit headers are captured on a new endpoint', async () => {
  const { es } = clientWith(200, { addresses: [] }, { 'X-RateLimit-Limit': '60', 'X-RateLimit-Remaining': '12', 'X-RateLimit-Reset': '1700000000' });
  await es.deliverability.listAddresses();
  assert.deepEqual(es.rateLimit, { limit: 60, remaining: 12, reset: 1700000000 });
});

test('X-Client-Id reaches a new endpoint on a withClientId() client', async () => {
  const cap = captureFetch(200, { domain: IDN, limit: 50, offset: 0, count: 0, next_offset: null, changes: [] });
  const base = new Emailsherlock({ apiKey: 'k', fetch: cap.fn });
  await base.withClientId(42).domains.changes(IDN);
  await base.domains.changes(IDN);
  assert.equal(cap.calls[0].headers.get('X-Client-Id'), '42');
  assert.equal(cap.calls[0].headers.get('X-API-Key'), 'k');
  assert.equal(cap.calls[1].headers.has('X-Client-Id'), false);
});
