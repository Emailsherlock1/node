# @emailsherlock/node

Official Node.js client for the [EmailSherlock](https://www.hostsherlock.com) email-verification API. Verify one address or a batch over HTTPS with an API key. Get an API key at https://www.hostsherlock.com/api. Want to try a single address by hand first? The free [email verification](https://www.hostsherlock.com/verify) tool runs the same checks in the browser.

Zero dependencies. Works on Node 18+ (uses the built-in `fetch`).

## Install

```bash
npm install @emailsherlock/node
```

## Quick start

```js
import { Emailsherlock } from '@emailsherlock/node';

// reads the key from the environment, never hard-code it
const es = new Emailsherlock(process.env.ES_KEY);

const result = await es.verify.single({ email: 'jane@acme.com' });

console.log(result.result); // 'valid'
console.log(result.score);  // 0.95
```

The constructor also reads `ES_KEY` (or `EMAILSHERLOCK_API_KEY`) from the
environment if you call `new Emailsherlock()` with no argument.

## Batch

Up to 100 addresses per call:

```js
const { results } = await es.verify.batch({
  emails: ['jane@acme.com', 'sales@acme.com'],
});

results[0].result; // 'valid'
results[1].role;   // true
```

A batch item is either a result object or a per-address error. Narrow it with
the type guard:

```js
import { isVerifyResult } from '@emailsherlock/node';

for (const item of results) {
  if (isVerifyResult(item)) {
    console.log(item.email, item.result);
  } else {
    console.log(item.email, 'failed:', item.error);
  }
}
```

## The result object

| field        | type      | meaning                                                         |
|--------------|-----------|-----------------------------------------------------------------|
| `email`      | string    | the address you sent                                            |
| `result`     | string    | `valid` · `invalid` · `catch_all` · `disposable` · `role` · `unknown` |
| `mx`         | boolean   | the domain has reachable MX records                             |
| `disposable` | boolean   | throwaway / temporary-mail provider                             |
| `role`       | boolean   | role address such as `info@` or `sales@`                        |
| `catch_all`  | boolean   | host accepts mail for any local part                            |
| `score`      | number / null | 0–1 confidence, higher is safer to send to (`null` when the verdict is `unknown`) |
| `freshness`  | string    | `fresh` · `cached_recent` · `cached_stale_refreshed`            |
| `deliverable`| boolean?  | proven via SMTP: `true` accepted, `false` provably bad, `null` unproven |
| `reason`     | string?   | why the pipeline decided (`mailbox_accepts`, `greylisted`, …)   |
| `mx_record`  | string?   | the primary MX host, when one was resolved                      |
| `free_email` | boolean?  | the domain is a freemail provider                               |
| `checked_at` | string?   | when the verification ran (ISO 8601)                            |
| `domain`     | object?   | domain-level intelligence (SPF, DKIM, DMARC, score, blacklists, …) |
| `decision`   | object    | `{ recommendation: allow·deny·review, reasons[] }`              |

Every field and model type is generated from the [OpenAPI spec](https://www.hostsherlock.com/api/docs) and exported, so your editor autocompletes the full shape.

## Async jobs

For large lists, submit a job and poll it. Every address runs the full pipeline
including the SMTP probe, so the results carry definitive inbox verdicts:

```js
const job = await es.verify.submitJob({ emails: ['a@acme.com', 'b@acme.com'] });

let status = job;
while (status.status !== 'completed') {
  await new Promise((r) => setTimeout(r, 2000));
  status = await es.verify.getJob(job.id);
}

console.log(status.results);
```

## Account status

```js
const account = await es.credits();
account.credits.total; // spendable credits
account.rateLimit;     // { limit, remaining, reset }
account.sandbox;       // true on an es_test_ key
```

## Email-Guard events

Record Email-Guard decision events (free, no credits). The full address is never
sent, only the domain:

```js
await es.guard.recordEvents([
  { domain: 'mailinator.com', verdict: 'disposable', action: 'deny', reasons: ['disposable_provider'], degraded: false, source: 'local' },
]);
```

## Deliverability checks

Read the verdicts of your Deliverability check addresses. `latest(id)` returns the
last cached verdict without a live probe, so you can call it right before a send:

```js
const { addresses } = await es.deliverability.listAddresses();
const gate = await es.deliverability.latest(addresses[0].id);
gate.has_result; // false until the first check ran

const page = await es.deliverability.listChecks(addresses[0].id, { limit: 20 });
const check = await es.deliverability.getCheck(page.checks[0].id);

// the response carries the signing secret this one time, store it
const { webhook } = await es.deliverability.setWebhook(addresses[0].id, { url: 'https://hooks.example.com/emailsherlock' });
await es.deliverability.deleteWebhook(addresses[0].id);
```

## DMARC

`start(domain)` adds the domain to the ones your account watches and returns the
record to publish. `check(domain)` looks the record up again:

```js
const setup = await es.dmarc.start('acme.com');
setup.record; // what to publish in DNS, or null

const status = await es.dmarc.check('acme.com');
status.confirmed; // true once the record carries your report address

const summary = await es.dmarc.summary('acme.com', { range: 7 });
const { reports } = await es.dmarc.reports('acme.com', { from: '2026-11-01', limit: 50 });
const { sources } = await es.dmarc.sources('acme.com', { result: 'fail' });
```

`summary`, `reports` and `sources` need your account's report address in the
domain's DMARC record. Watching a domain does not unlock its reports; without the
address they throw a `ForbiddenError`.

## TLS-RPT

```js
const { reports } = await es.tlsRpt.reports('acme.com', { range: 30 });
```

This needs your account's report address in the domain's TLS-RPT record.

## Domain changes and next steps

```js
const { changes } = await es.domains.changes('acme.com', { limit: 25 });

const next = await es.domains.nextSteps('acme.com');
next.ladder;            // the steps from monitoring to p=reject, null at p=reject
next.unaligned_sources; // sources that still fail DMARC, with the repair for each
```

`changes` works for any domain you watch. `nextSteps` needs your account's report
address in the domain's DMARC record.

The Deliverability, DMARC, TLS-RPT and domain calls are free and consume no credits.

## Impersonation

Send the sender header fields of one message plus the identities you protect.
No subject or body is accepted. This call costs credits:

```js
const verdict = await es.impersonation.analyze({
  from: 'jane.doe@gmail.com',
  display_name: 'Jane Doe',
  protected: [{ name: 'Jane Doe', domains: ['acme.com'] }],
});

verdict.risk;    // 'none' · 'low' · 'medium' · 'high'
verdict.reasons; // [{ reason: 'display_name', weight, detail }, …]
```

The identity list goes in `protected`, the field name the API reads.

## Credits and rate limits

After every call the client exposes what the response headers reported:

```js
es.creditsRemaining;   // e.g. 41
es.rateLimit;          // { limit, remaining, reset }
```

## Errors

Every failure throws a subclass of `EmailsherlockError`:

| class                       | HTTP | when                                          |
|-----------------------------|------|-----------------------------------------------|
| `AuthenticationError`       | 401  | missing or invalid API key                    |
| `ForbiddenError`            | 403  | key lacks the endpoint's scope (`requiredScope`) |
| `InsufficientCreditsError`  | 402  | not enough credits (`creditsRequired`, `creditsRemaining`) |
| `RateLimitError`            | 429  | rate limit hit (`retryAfter`, `limit`, `remaining`, `reset`) |
| `ValidationError`           | 400 / 404 / 422 | the request was rejected, or the job, address or domain was not found |
| `ServiceUnavailableError`   | 503  | the service could not answer just now (on verify and impersonation the credit is auto-refunded) |

Any other status, such as `409` from `dmarc.start` when your plan's watch slots are
used up, throws the base `EmailsherlockError` with `status` and `code` set.

```js
import { RateLimitError } from '@emailsherlock/node';

try {
  await es.verify.single({ email: 'jane@acme.com' });
} catch (err) {
  if (err instanceof RateLimitError) {
    console.log(`retry after ${err.retryAfter}s`);
  } else {
    throw err;
  }
}
```

## Working for a tenant (`X-Client-Id`)

If your key belongs to a provider account, you can run a call inside one of its tenants by naming the tenant's numeric id. Usage, verify jobs (and their refunds), deliverability addresses and Guard events then land in that tenant. Without it, the key works in its own account.

```js
// one client for one tenant
const es = new Emailsherlock({ apiKey: process.env.ES_KEY, clientId: 123 });

// or derive tenant clients from one key
const base = new Emailsherlock(process.env.ES_KEY);
const tenant = base.withClientId(123); // new client, `base` is unchanged
tenant.clientId; // 123
```

`withClientId()` keeps the key, base URL, fetch and timeout, and each client tracks its own credits and rate limit. Poll a job with the same client you submitted it with, because a job belongs to the tenant it was submitted for. `clientId` must be a positive integer, otherwise the constructor throws a `config_error`.

Three errors are specific to this header, and `err.code` holds the server code:

| HTTP | `err.code`              | class             | when                                                   |
|------|-------------------------|-------------------|--------------------------------------------------------|
| 404  | `client_not_found`      | `ValidationError` | the id is not a tenant your key may reach              |
| 403  | `forbidden`             | `ForbiddenError`  | the tenant is blocked from the API                     |
| 400  | `client_id_not_allowed` | `ValidationError` | your key is not a provider key (even an empty header)  |

## Options

```js
new Emailsherlock({
  apiKey: process.env.ES_KEY,
  baseUrl: 'https://api.emailsherlock.com', // default
  timeoutMs: 30000,                          // default
  fetch: customFetch,                        // optional injection
  clientId: 123,                             // optional, provider keys only
});
```

## License

MIT. Full API reference: https://www.hostsherlock.com/api/docs
