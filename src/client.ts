import {
  Configuration,
  VerifyApi,
  AccountApi,
  GuardApi,
  type Middleware,
  type ResponseContext,
} from './generated/index.js';
import type {
  VerifyResultResponse,
  VerifyBatchResponse,
  VerifyJobResponse,
  AccountStatusResponse,
  GuardEventsRequest,
} from './generated/index.js';
import { VERSION } from './version.js';
import { EmailsherlockError, toEmailsherlockError } from './errors.js';
import type { RateLimit } from './types.js';

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

/** Run a generated-client call, mapping any failure to a named error. */
async function call<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    throw await toEmailsherlockError(err);
  }
}

/** Verify-endpoint methods, reached as `client.verify`. */
export class VerifyResource {
  constructor(private readonly api: VerifyApi) {}

  /** Verify a single address. */
  single(params: { email: string }): Promise<VerifyResultResponse> {
    return call(() => this.api.verifySingle({ verifySingleRequest: { email: params.email } }));
  }

  /** Verify a batch of addresses in one call. */
  batch(params: { emails: string[] }): Promise<VerifyBatchResponse> {
    return call(() => this.api.verifyBatch({ verifyBatchRequest: { emails: params.emails } }));
  }

  /** Submit a list of addresses for asynchronous verification. Poll with `getJob`. */
  submitJob(params: { emails: string[] }): Promise<VerifyJobResponse> {
    return call(() => this.api.submitVerifyJob({ verifyJobRequest: { emails: params.emails } }));
  }

  /** Read the status and results of a verification job. */
  getJob(id: string): Promise<VerifyJobResponse> {
    return call(() => this.api.getVerifyJob({ id }));
  }
}

/** Email-Guard event methods, reached as `client.guard`. */
export class GuardResource {
  constructor(private readonly api: GuardApi) {}

  /** Record a batch of Email-Guard decision events (free, no credits). */
  recordEvents(events: GuardEventsRequest['events']): Promise<void> {
    return call(() => this.api.recordGuardEvents({ guardEventsRequest: { events } }));
  }
}

export class Emailsherlock {
  readonly verify: VerifyResource;
  readonly guard: GuardResource;

  /** Credits left after the most recent request (from X-Credits-Remaining). */
  creditsRemaining: number | null = null;
  /** Rate-limit window after the most recent request (from X-RateLimit-*). */
  rateLimit: RateLimit = { limit: null, remaining: null, reset: null };

  private readonly account: AccountApi;

  constructor(apiKey?: string | ClientOptions, options: ClientOptions = {}) {
    const opts: ClientOptions =
      typeof apiKey === 'string' ? { ...options, apiKey } : (apiKey ?? {});

    const key = opts.apiKey ?? process.env.ES_KEY ?? process.env.EMAILSHERLOCK_API_KEY;
    if (!key) {
      throw new EmailsherlockError(
        'No API key provided. Pass it to the constructor or set ES_KEY.',
        { code: 'config_error' },
      );
    }

    const baseFetch = opts.fetch ?? globalThis.fetch;
    if (!baseFetch) {
      throw new EmailsherlockError(
        'No fetch implementation available. Use Node 18+ or pass options.fetch.',
        { code: 'config_error' },
      );
    }

    const timeoutMs = opts.timeoutMs ?? 30_000;

    // Capture credit + rate-limit headers off every response, success or error.
    const captureMeta: Middleware = {
      post: async (context: ResponseContext): Promise<void> => {
        this.captureMeta(context.response.headers);
      },
    };

    const configuration = new Configuration({
      basePath: (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, ''),
      apiKey: key, // sets the X-API-Key header for ApiKeyAuth
      headers: { 'User-Agent': `emailsherlock-node/${VERSION}` },
      fetchApi: this.withTimeout(baseFetch, timeoutMs),
      middleware: [captureMeta],
    });

    this.verify = new VerifyResource(new VerifyApi(configuration));
    this.guard = new GuardResource(new GuardApi(configuration));
    this.account = new AccountApi(configuration);
  }

  /** Read the credit balance and rate-limit status. Free: consumes no credits. */
  credits(): Promise<AccountStatusResponse> {
    return call(() => this.account.getCredits());
  }

  private withTimeout(baseFetch: typeof fetch, timeoutMs: number): typeof fetch {
    return async (input, init) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const upstream = init?.signal;
      if (upstream) {
        if (upstream.aborted) controller.abort();
        else upstream.addEventListener('abort', () => controller.abort(), { once: true });
      }
      try {
        return await baseFetch(input, { ...init, signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
    };
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
