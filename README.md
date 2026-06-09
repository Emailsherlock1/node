# @emailsherlock/node

Official Node.js client for the [EmailSherlock](https://emailsherlock.com) email-verification API. Verify one address or a batch over HTTPS with an API key. Get an API key at https://emailsherlock.com/api

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
| `deliverable`| boolean / null | SMTP-proven: `true` only after an SMTP accept, `false` only on a provable failure, `null` when unproven |
| `reason`     | string / null | why the verdict came out the way it did, e.g. `mailbox_accepts` · `mailbox_not_found` · `no_mx` · `bad_syntax` · `disposable_provider` · `role_address` · `catch_all_domain` · `greylisted` · `smtp_timeout` · `smtp_unreachable` · `verification_pending` |
| `mx_record`  | string / null | the primary MX host for the domain                          |
| `free_email` | boolean / null | the address belongs to a free webmail provider             |
| `checked_at` | string / null | when the check ran, ISO 8601                                |
| `domain`     | object / null | domain-level intelligence, see below                        |

The fields from `deliverable` down are additive and may be missing until the
API rollout completes; once present they are always set but nullable.

### The domain object

| field          | type      | meaning                                                  |
|----------------|-----------|----------------------------------------------------------|
| `name`         | string    | the domain part of the address                           |
| `types`        | string[] / null | host types: `freemail` · `disposable` · `custom` · `company` · `government` · `education` · `public` · `isp` |
| `score`        | number / null | domain trust score, 0-100, higher is better          |
| `spf`          | boolean / null | the domain publishes an SPF record                  |
| `dkim`         | boolean / null | the domain publishes at least one DKIM key          |
| `dmarc`        | boolean / null | the domain publishes a DMARC record                 |
| `dmarc_policy` | string / null | `none` · `quarantine` · `reject`                     |
| `mta_sts`      | boolean / null | the domain publishes an MTA-STS policy              |
| `tls_rpt`      | boolean / null | the domain publishes a TLS-RPT record               |
| `bimi`         | boolean / null | the domain publishes a BIMI record                  |
| `dane`         | boolean / null | the MX hosts publish DANE/TLSA records              |
| `blacklists`   | number / null | DNS blacklists currently listing the domain's mail IPs |
| `dnssec`       | string / null | `secure` · `insecure` · `bogus`                      |
| `caa`          | boolean / null | the domain publishes a CAA record                   |

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
| `ValidationError`           | 400 / 422 | the request body was rejected            |
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
