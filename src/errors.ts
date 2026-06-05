function num(value: string | null): number | null {
  if (value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

interface ApiErrorEnvelope {
  error?: { code?: string; message?: string; required_scope?: string };
}

export interface ErrorOptions {
  status?: number;
  code?: string;
}

/** Base class for every error this client throws. */
export class EmailsherlockError extends Error {
  readonly status?: number;
  readonly code?: string;

  constructor(message: string, options: ErrorOptions = {}) {
    super(message);
    this.name = new.target.name;
    this.status = options.status;
    this.code = options.code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** 401 — missing or invalid API key. */
export class AuthenticationError extends EmailsherlockError {}

/** 403 — the key lacks the scope this endpoint needs. */
export class ForbiddenError extends EmailsherlockError {
  requiredScope?: string;
}

/** 402 — not enough credits on the wallet for this request. */
export class InsufficientCreditsError extends EmailsherlockError {
  creditsRequired?: number | null;
  creditsRemaining?: number | null;
}

/** 429 — per-key sliding-window rate limit hit. */
export class RateLimitError extends EmailsherlockError {
  retryAfter?: number | null;
  limit?: number | null;
  remaining?: number | null;
  reset?: number | null;
}

/** 400 / 422 — the request body was rejected. */
export class ValidationError extends EmailsherlockError {}

/** 503 — the verify engine could not answer; the credit was auto-refunded. */
export class ServiceUnavailableError extends EmailsherlockError {}

export function errorFromResponse(
  status: number,
  body: ApiErrorEnvelope | null,
  headers: Headers,
): EmailsherlockError {
  const envelope = body?.error ?? {};
  const code = envelope.code;
  const message = envelope.message ?? `HTTP ${status}`;
  const opts: ErrorOptions = { status, code };

  switch (status) {
    case 401:
      return new AuthenticationError(message, opts);
    case 403: {
      const err = new ForbiddenError(message, opts);
      err.requiredScope = envelope.required_scope ?? headers.get('X-Required-Scope') ?? undefined;
      return err;
    }
    case 402: {
      const err = new InsufficientCreditsError(message, opts);
      err.creditsRequired = num(headers.get('X-Credits-Required'));
      err.creditsRemaining = num(headers.get('X-Credits-Remaining'));
      return err;
    }
    case 429: {
      const err = new RateLimitError(message, opts);
      err.retryAfter = num(headers.get('Retry-After'));
      err.limit = num(headers.get('X-RateLimit-Limit'));
      err.remaining = num(headers.get('X-RateLimit-Remaining'));
      err.reset = num(headers.get('X-RateLimit-Reset'));
      return err;
    }
    case 400:
    case 422:
      return new ValidationError(message, opts);
    case 503:
      return new ServiceUnavailableError(message, opts);
    default:
      return new EmailsherlockError(message, opts);
  }
}
