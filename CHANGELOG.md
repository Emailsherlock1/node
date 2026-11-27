# Changelog

## 0.5.0

### Added

- `es.probeCreditsRemaining` and `es.validationsRemaining`: the two balances the API reports, read from `X-Probe-Credits-Remaining` and `X-Validations-Remaining` (falling back to the older header names). `validationsRemaining` stays `null` on a paid plan, where standard verify is unlimited.

### Changed

- `InsufficientCreditsError.creditsRemaining` reads `X-Probe-Credits-Remaining` first.

### Deprecated

- `es.creditsRemaining`: holds the same value as `probeCreditsRemaining`.

## 0.4.0

### Added

- `es.deliverability`: `listAddresses()`, `latest(id)` (the pre-send gate), `listChecks(id, { limit, offset })`, `getCheck(id)`, `setWebhook(id, { url })` (returns the signing secret once) and `deleteWebhook(id)`.
- `es.dmarc`: `start(domain)`, `check(domain)`, `summary(domain, { range })`, `reports(domain, { from, to, reporter, limit, offset })` and `sources(domain, { range, result, check, limit, offset })`.
- `es.tlsRpt.reports(domain, { range, limit, offset })` for the TLS-RPT reports of a domain.
- `es.domains`: `changes(domain, { limit, offset })` and `nextSteps(domain)`.
- `es.impersonation.analyze(request)` scores whether a sender poses as one of the identities you protect. The request type `ImpersonationAnalyzeParams` uses the wire field `protected`.
- `clientId` option and `es.withClientId(id)` send `X-Client-Id`, so a provider key can work inside one of its tenants. Invalid ids throw a `config_error`; the `client_not_found`, `forbidden` and `client_id_not_allowed` server codes are readable on `err.code`. This was merged after 0.3.0 was published and ships with this release.
- Response and option types for the new endpoints are exported.

### Changed

- The generated doc comments now point at https://www.hostsherlock.com/api/docs.

## 0.3.0

The client is now generated from the EmailSherlock OpenAPI spec, with a thin
hand-maintained sugar layer on top. The public surface from 0.2.0 is unchanged;
this release adds the endpoints and result fields the API already served.

### Added

- `es.credits()` reads the account status (credit buckets, rate limit, plan, sandbox flag).
- `es.verify.submitJob({ emails })` and `es.verify.getJob(id)` for asynchronous verification jobs.
- `es.guard.recordEvents(events)` records Email-Guard decision events.
- `decision` result field on single and batch results.
- All response and request model types are exported, generated from the spec.

### Changed

- The HTTP client and models are regenerated from `openapi.json` instead of hand-written. Named error classes (`AuthenticationError`, `InsufficientCreditsError`, `RateLimitError`, …), `creditsRemaining`, the rate-limit accessor, and the `ES_KEY` / `EMAILSHERLOCK_API_KEY` env fallback are unchanged.
- Result fields keep the wire names (`catch_all`, `mx_record`, `free_email`, `checked_at`), same as 0.2.0. No camelCase rename, so existing field access keeps working.
- `ValidationError` now also covers `404` (job not found).

## 0.2.0

Verify response v2 fields on the hand-written client. Results gain `deliverable`, `reason`, `mx_record`, `free_email`, `checked_at` and a `domain` object (types, trust score, SPF/DKIM/DMARC and other mail-security signals). The new fields are nullable and may be missing on responses from API servers that do not send them yet.

## 0.1.0

Initial release: `es.verify.single` / `es.verify.batch`, named error classes, credit and rate-limit accessors.
