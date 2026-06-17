# Changelog

## 0.2.0

The client is now generated from the EmailSherlock OpenAPI spec, with a thin
hand-maintained sugar layer on top. The public surface from 0.1.0 is unchanged;
this release adds the endpoints and result fields the API already served.

### Added

- `es.credits()` reads the account status (credit buckets, rate limit, plan, sandbox flag).
- `es.verify.submitJob({ emails })` and `es.verify.getJob(id)` for asynchronous verification jobs.
- `es.guard.recordEvents(events)` records Email-Guard decision events.
- Richer single/batch result fields: `deliverable`, `reason`, `mx_record`, `free_email`, `checked_at`, `domain` (full domain intelligence), and `decision`.
- All response and request model types are exported, generated from the spec.

### Changed

- The HTTP client and models are regenerated from `openapi.json` instead of hand-written. Named error classes (`AuthenticationError`, `InsufficientCreditsError`, `RateLimitError`, …), `creditsRemaining`, the rate-limit accessor, and the `ES_KEY` / `EMAILSHERLOCK_API_KEY` env fallback are unchanged.
- `ValidationError` now also covers `404` (job not found).

## 0.1.0

Initial release: `es.verify.single` / `es.verify.batch`, named error classes, credit and rate-limit accessors.
