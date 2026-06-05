import { VERSION } from './version.js';
import { errorFromResponse, EmailsherlockError } from './errors.js';
import type { VerifyResult, BatchResponse, RateLimit } from './types.js';

const DEFAULT_BASE_URL = 'https://api.emailsherlock.com';

export interface ClientOptions {
  /** Your API key. Falls back to ES_KEY / EMAILSHERLOCK_API_KEY in the env. */
  apiKey?: string;
  /** Override the API base URL (e.g. a staging host). */
  baseUrl?: string;
  /** Per-request timeout in milliseconds. Default 30000. */
  timeoutMs?: number;
  /** Inject a fetch implementation. Defaults to the global fetch (Node 18+). */
  fetch?: typeof fetch;
}

function num(value: string | null): number | null {
  if (value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Verify-endpoint methods, reached as `client.verify`. */
export class VerifyResource {
  constructor(private readonly client: Emailsherlock) {}

  /** Verify a single address. */
  single(params: { email: string }): Promise<VerifyResult> {
    return this.client.request<VerifyResult>('/v1/verify/single', { email: params.email });
  }

  /** Verify up to 100 addresses in one call. */
  batch(params: { emails: string[] }): Promise<BatchResponse> {
    return this.client.request<BatchResponse>('/v1/verify/batch', { emails: params.emails });
  }
}

export class Emailsherlock {
  readonly verify: VerifyResource;

  /** Credits left after the most recent request (from X-Credits-Remaining). */
  creditsRemaining: number | null = null;
  /** Rate-limit window after the most recent request (from X-RateLimit-*). */
  rateLimit: RateLimit = { limit: null, remaining: null, reset: null };

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(apiKey?: string | ClientOptions, options: ClientOptions = {}) {
    const opts: ClientOptions =
      typeof apiKey === 'string' ? { ...options, apiKey } : (apiKey ?? {});

    const key =
      opts.apiKey ?? process.env.ES_KEY ?? process.env.EMAILSHERLOCK_API_KEY;
    if (!key) {
      throw new EmailsherlockError(
        'No API key provided. Pass it to the constructor or set ES_KEY.',
        { code: 'config_error' },
      );
    }

    const fetchImpl = opts.fetch ?? globalThis.fetch;
    if (!fetchImpl) {
      throw new EmailsherlockError(
        'No fetch implementation available. Use Node 18+ or pass options.fetch.',
        { code: 'config_error' },
      );
    }

    this.apiKey = key;
    this.baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.timeoutMs = opts.timeoutMs ?? 30_000;
    this.fetchImpl = fetchImpl;
    this.verify = new VerifyResource(this);
  }

  /** Low-level POST. Most callers should use `client.verify.*` instead. */
  async request<T>(path: string, body: unknown): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let res: Response;
    try {
      res = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
          'User-Agent': `emailsherlock-node/${VERSION}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      throw new EmailsherlockError(`Request to ${path} failed: ${reason}`, {
        code: 'network_error',
      });
    } finally {
      clearTimeout(timer);
    }

    this.captureMeta(res.headers);

    const text = await res.text();
    const json = text ? safeParse(text) : null;

    if (!res.ok) {
      throw errorFromResponse(res.status, json as never, res.headers);
    }

    return json as T;
  }

  private captureMeta(headers: Headers): void {
    const credits = headers.get('X-Credits-Remaining');
    if (credits !== null) {
      this.creditsRemaining = num(credits);
    }
    if (headers.get('X-RateLimit-Limit') !== null) {
      this.rateLimit = {
        limit: num(headers.get('X-RateLimit-Limit')),
        remaining: num(headers.get('X-RateLimit-Remaining')),
        reset: num(headers.get('X-RateLimit-Reset')),
      };
    }
  }
}
