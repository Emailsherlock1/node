# @emailsherlock/node

Official Node.js client for the [EmailSherlock](https://emailsherlock.com) email-verification API. Verify one address or a batch over HTTPS with an API key.

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
| `score`      | number    | 0–1 confidence, higher is safer to send to                      |
| `freshness`  | string    | `fresh` · `cached_recent` · `cached_stale_refreshed`            |
| `deliverable`| boolean?  | proven via SMTP: `true` accepted, `false` provably bad, `null` unproven |
| `reason`     | string?   | why the pipeline decided (`mailbox_accepts`, `greylisted`, …)   |
| `mx_record`  | string?   | the primary MX host, when one was resolved                      |
| `free_email` | boolean?  | the domain is a freemail provider                               |
| `checked_at` | string?   | when the verification ran (ISO 8601)                            |
| `domain`     | object?   | domain-level intelligence (SPF, DKIM, DMARC, score, blacklists, …) |
| `decision`   | object    | `{ recommendation: allow·deny·review, reasons[] }`              |

Every field and model type is generated from the [OpenAPI spec](https://emailsherlock.com/api/docs) and exported, so your editor autocompletes the full shape.

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
| `ValidationError`           | 400 / 404 / 422 | the request was rejected, or the job was not found |
| `ServiceUnavailableError`   | 503  | verify engine unavailable (the credit is auto-refunded) |

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

## Options

```js
new Emailsherlock({
  apiKey: process.env.ES_KEY,
  baseUrl: 'https://api.emailsherlock.com', // default
  timeoutMs: 30000,                          // default
  fetch: customFetch,                        // optional injection
});
```

## License

MIT. Full API reference: https://emailsherlock.com/api/docs
