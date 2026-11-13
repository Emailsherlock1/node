# Changelog

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
