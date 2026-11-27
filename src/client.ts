import {
  Configuration,
  VerifyApi,
  AccountApi,
  GuardApi,
  DeliverabilityApi,
  DomainReportsApi,
  DomainSetupApi,
  ImpersonationApi,
  type Middleware,
  type ResponseContext,
} from './generated/index.js';
import type {
  VerifyResultResponse,
  VerifyBatchResponse,
  VerifyJobResponse,
  AccountStatusResponse,
  GuardEventsRequest,
  ListCheckAddresses200Response,
  DeliverabilityLatestVerdictResource,
  ListChecks200Response,
  GetCheck200Response,
  DeliverabilityWebhookResource,
  DmarcSetupResource,
  DmarcSummaryResource,
  ListDmarcReports200Response,
  ListDmarcSources200Response,
  ListTlsRptReports200Response,
  ListDomainChanges200Response,
  NextStepsResource,
  ImpersonationAnalyzeRequest,
  ImpersonationAnalyzeResponse,
} from './generated/index.js';
import { VERSION } from './version.js';
import { EmailsherlockError, toEmailsherlockError } from './errors.js';
import type {
  RateLimit,
  ListChecksOptions,
  DmarcSummaryOptions,
  DmarcReportsOptions,
  DmarcSourcesOptions,
  TlsRptReportsOptions,
  DomainChangesOptions,
  ImpersonationAnalyzeParams,
} from './types.js';

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
  /**
   * Work inside one of your tenants: the numeric id of a tenant of your provider
   * account. Sent as `X-Client-Id` on every request. Only provider keys may set it.
   */
  clientId?: number;
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

/** Deliverability check-address methods, reached as `client.deliverability`. Free: no credits. */
export class DeliverabilityResource {
  constructor(private readonly api: DeliverabilityApi) {}

  /** List your check addresses, each with its latest verdict. */
  listAddresses(): Promise<ListCheckAddresses200Response> {
    return call(() => this.api.listCheckAddresses());
  }

  /** The pre-send gate: the latest cached verdict for an address (no live probe). */
  latest(id: number): Promise<DeliverabilityLatestVerdictResource> {
    return call(() => this.api.getLatestVerdict({ id }));
  }

  /** The check log for one address, newest first. */
  listChecks(id: number, options: ListChecksOptions = {}): Promise<ListChecks200Response> {
    return call(() => this.api.listChecks({ ...options, id }));
  }

  /** One check with its full audit breakdown. */
  getCheck(id: number): Promise<GetCheck200Response> {
    return call(() => this.api.getCheck({ id }));
  }

  /** Set or replace the check.completed webhook for an address. The response carries the signing secret this one time. */
  setWebhook(id: number, params: { url: string }): Promise<DeliverabilityWebhookResource> {
    return call(() => this.api.setCheckWebhook({ id, setCheckWebhookRequest: { url: params.url } }));
  }

  /** Remove the check.completed webhook for an address. */
  deleteWebhook(id: number): Promise<DeliverabilityWebhookResource> {
    return call(() => this.api.deleteCheckWebhook({ id }));
  }
}

/** DMARC setup and report methods, reached as `client.dmarc`. Free: no credits. */
export class DmarcResource {
  constructor(
    private readonly setup: DomainSetupApi,
    private readonly reportsApi: DomainReportsApi,
  ) {}

  /** Start DMARC monitoring for a domain and get the DNS record to publish. */
  start(domain: string): Promise<DmarcSetupResource> {
    return call(() => this.setup.startDmarcMonitoring({ domain }));
  }

  /** Look up a watched domain's DMARC record again and say whether it carries your report address. */
  check(domain: string): Promise<DmarcSetupResource> {
    return call(() => this.setup.checkDmarcSetup({ domain }));
  }

  /** Totals of a domain's DMARC reports over 7 or 30 days. Needs your report address in the domain's DMARC record. */
  summary(domain: string, options: DmarcSummaryOptions = {}): Promise<DmarcSummaryResource> {
    return call(() => this.reportsApi.getDmarcSummary({ ...options, domain }));
  }

  /** A domain's DMARC aggregate reports, newest first. Needs your report address in the domain's DMARC record. */
  reports(domain: string, options: DmarcReportsOptions = {}): Promise<ListDmarcReports200Response> {
    return call(() => this.reportsApi.listDmarcReports({ ...options, domain }));
  }

  /** The sending sources seen in a domain's DMARC reports. Needs your report address in the domain's DMARC record. */
  sources(domain: string, options: DmarcSourcesOptions = {}): Promise<ListDmarcSources200Response> {
    return call(() => this.reportsApi.listDmarcSources({ ...options, domain }));
  }
}

/** TLS-RPT report methods, reached as `client.tlsRpt`. Free: no credits. */
export class TlsRptResource {
  constructor(private readonly api: DomainReportsApi) {}

  /** The TLS-RPT reports your account received for a domain, newest first. Needs your report address in the domain's TLS-RPT record. */
  reports(domain: string, options: TlsRptReportsOptions = {}): Promise<ListTlsRptReports200Response> {
    return call(() => this.api.listTlsRptReports({ ...options, domain }));
  }
}

/** Methods on a domain you watch, reached as `client.domains`. Free: no credits. */
export class DomainsResource {
  constructor(private readonly api: DomainReportsApi) {}

  /** The timeline of a domain you watch: DNS, record and mail changes, newest first. */
  changes(domain: string, options: DomainChangesOptions = {}): Promise<ListDomainChanges200Response> {
    return call(() => this.api.listDomainChanges({ ...options, domain }));
  }

  /** What to change next on a domain you own, on the way to p=reject. Needs your report address in the domain's DMARC record. */
  nextSteps(domain: string): Promise<NextStepsResource> {
    return call(() => this.api.getDomainNextSteps({ domain }));
  }
}

/** Impersonation scoring, reached as `client.impersonation`. Costs credits. */
export class ImpersonationResource {
  constructor(private readonly api: ImpersonationApi) {}

  /**
   * Score whether a sender poses as one of the identities you protect. Send
   * the From address, optional display name, Reply-To and DMARC result, plus
   * the `protected` identities.
   */
  analyze(request: ImpersonationAnalyzeParams): Promise<ImpersonationAnalyzeResponse> {
    // The generated model names the list `_protected`, but the runtime sends
    // the body object as-is, so passing the wire-shaped object keeps `protected`.
    const body = request as unknown as ImpersonationAnalyzeRequest;
    return call(() => this.api.analyzeImpersonation({ impersonationAnalyzeRequest: body }));
  }
}

export class Emailsherlock {
  readonly verify: VerifyResource;
  readonly guard: GuardResource;
  readonly deliverability: DeliverabilityResource;
  readonly dmarc: DmarcResource;
  readonly tlsRpt: TlsRptResource;
  readonly domains: DomainsResource;
  readonly impersonation: ImpersonationResource;
  /** The tenant this client works in, or undefined for the key's own account. */
  readonly clientId?: number;

  /** Credits left after the most recent request (from X-Credits-Remaining). */
  creditsRemaining: number | null = null;
  /** Rate-limit window after the most recent request (from X-RateLimit-*). */
  rateLimit: RateLimit = { limit: null, remaining: null, reset: null };

  private readonly account: AccountApi;
  private readonly resolved: ClientOptions & { apiKey: string };

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

    const clientId = opts.clientId;
    if (clientId !== undefined && (!Number.isSafeInteger(clientId) || clientId <= 0)) {
      throw new EmailsherlockError('clientId must be a positive integer.', {
        code: 'config_error',
      });
    }
    this.clientId = clientId;
    this.resolved = { apiKey: key, baseUrl: opts.baseUrl, timeoutMs, fetch: baseFetch };

    // Capture credit + rate-limit headers off every response, success or error.
    const captureMeta: Middleware = {
      post: async (context: ResponseContext): Promise<void> => {
        this.captureMeta(context.response.headers);
      },
    };

    const configuration = new Configuration({
      basePath: (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, ''),
      apiKey: key, // sets the X-API-Key header for ApiKeyAuth
      headers: {
        'User-Agent': `emailsherlock-node/${VERSION}`,
        ...(clientId !== undefined ? { 'X-Client-Id': String(clientId) } : {}),
      },
      fetchApi: this.withTimeout(baseFetch, timeoutMs),
      middleware: [captureMeta],
    });

    this.verify = new VerifyResource(new VerifyApi(configuration));
    this.guard = new GuardResource(new GuardApi(configuration));
    const domainReports = new DomainReportsApi(configuration);
    this.deliverability = new DeliverabilityResource(new DeliverabilityApi(configuration));
    this.dmarc = new DmarcResource(new DomainSetupApi(configuration), domainReports);
    this.tlsRpt = new TlsRptResource(domainReports);
    this.domains = new DomainsResource(domainReports);
    this.impersonation = new ImpersonationResource(new ImpersonationApi(configuration));
    this.account = new AccountApi(configuration);
  }

  /** Read the credit balance and rate-limit status. Free: consumes no credits. */
  credits(): Promise<AccountStatusResponse> {
    return call(() => this.account.getCredits());
  }

  /**
   * Return a new client that works in the given tenant, with the same key,
   * base URL, fetch and timeout. This client stays unchanged and keeps its own
   * credits and rate-limit meta.
   */
  withClientId(clientId: number): Emailsherlock {
    return new Emailsherlock({ ...this.resolved, clientId });
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
