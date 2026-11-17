/* tslint:disable */
/* eslint-disable */
/**
 * 
 * @export
 * @interface AccountStatusResponse
 */
export interface AccountStatusResponse {
    /**
     * 
     * @type {AccountStatusResponseCredits}
     * @memberof AccountStatusResponse
     */
    credits: AccountStatusResponseCredits;
    /**
     * 
     * @type {AccountStatusResponseRateLimit}
     * @memberof AccountStatusResponse
     */
    rate_limit: AccountStatusResponseRateLimit;
    /**
     * The plan behind the key.
     * @type {string}
     * @memberof AccountStatusResponse
     */
    plan?: string | null;
    /**
     * Whether the key is a sandbox key (es_test_).
     * @type {boolean}
     * @memberof AccountStatusResponse
     */
    sandbox: boolean;
}
/**
 * Credit balance buckets.
 * @export
 * @interface AccountStatusResponseCredits
 */
export interface AccountStatusResponseCredits {
    /**
     * Spendable credits across all buckets.
     * @type {number}
     * @memberof AccountStatusResponseCredits
     */
    total?: number;
    /**
     * 
     * @type {number}
     * @memberof AccountStatusResponseCredits
     */
    purchased?: number;
    /**
     * 
     * @type {number}
     * @memberof AccountStatusResponseCredits
     */
    gifted?: number;
}
/**
 * The per-key sliding-window rate limit.
 * @export
 * @interface AccountStatusResponseRateLimit
 */
export interface AccountStatusResponseRateLimit {
    /**
     * Requests per minute for this key.
     * @type {number}
     * @memberof AccountStatusResponseRateLimit
     */
    limit?: number;
    /**
     * Requests left in the current window. This call counted against it.
     * @type {number}
     * @memberof AccountStatusResponseRateLimit
     */
    remaining?: number;
    /**
     * Unix timestamp when the window frees up.
     * @type {number}
     * @memberof AccountStatusResponseRateLimit
     */
    reset?: number;
}
/**
 * 
 * @export
 * @interface ApiError
 */
export interface ApiError {
    /**
     * 
     * @type {ApiErrorError}
     * @memberof ApiError
     */
    error: ApiErrorError;
}
/**
 * 
 * @export
 * @interface ApiErrorError
 */
export interface ApiErrorError {
    /**
     * A stable machine-readable error code.
     * @type {string}
     * @memberof ApiErrorError
     */
    code: string;
    /**
     * A human-readable explanation.
     * @type {string}
     * @memberof ApiErrorError
     */
    message: string;
}
/**
 * 
 * @export
 * @interface BatchItemError
 */
export interface BatchItemError {
    /**
     * The address that failed, or null if the input was not a string.
     * @type {string}
     * @memberof BatchItemError
     */
    email?: string | null;
    /**
     * Why this address could not be processed.
     * @type {BatchItemErrorErrorEnum}
     * @memberof BatchItemError
     */
    error: BatchItemErrorErrorEnum;
}


/**
 * @export
 */
export const BatchItemErrorErrorEnum = {
    InvalidEmail: 'invalid_email',
    InsufficientCredits: 'insufficient_credits',
    VerifyUnavailable: 'verify_unavailable'
} as const;
export type BatchItemErrorErrorEnum = typeof BatchItemErrorErrorEnum[keyof typeof BatchItemErrorErrorEnum];

/**
 * 
 * @export
 * @interface GuardEventsRequest
 */
export interface GuardEventsRequest {
    /**
     * Guard decision events to record. Non-empty, capped per the batch limit. Each item: {domain?, verdict, action, reasons[], degraded, source, integration?, lib_version?, spec_version?, property_key?}. The full email address is never sent, only the domain. property_key is the optional public site-key of a property (EM-998); when it matches one of your properties the event is attributed to it, otherwise the event still records at the account level.
     * @type {Array<object>}
     * @memberof GuardEventsRequest
     */
    events: Array<object>;
}
/**
 * 
 * @export
 * @interface VerifyBatchRequest
 */
export interface VerifyBatchRequest {
    /**
     * The addresses to verify. Non-empty, capped per the batch limit.
     * @type {Array<string>}
     * @memberof VerifyBatchRequest
     */
    emails: Array<string>;
}
/**
 * 
 * @export
 * @interface VerifyBatchResponse
 */
export interface VerifyBatchResponse {
    /**
     * One entry per submitted address, in order. Each entry is a verify result, or a per-item error for an address that could not be processed.
     * @type {Array<VerifyBatchResponseResultsInner>}
     * @memberof VerifyBatchResponse
     */
    results: Array<VerifyBatchResponseResultsInner>;
}
/**
 * @type VerifyBatchResponseResultsInner
 * 
 * @export
 */
export type VerifyBatchResponseResultsInner = BatchItemError | VerifyResultResponse;
/**
 * 
 * @export
 * @interface VerifyDecisionResponse
 */
export interface VerifyDecisionResponse {
    /**
     * Recommended action. Policy authority stays with the caller.
     * @type {VerifyDecisionResponseRecommendationEnum}
     * @memberof VerifyDecisionResponse
     */
    recommendation: VerifyDecisionResponseRecommendationEnum;
    /**
     * Signals that drove the recommendation. Values correspond to VerifyReason identifiers.
     * @type {Array<string>}
     * @memberof VerifyDecisionResponse
     */
    reasons: Array<string>;
}


/**
 * @export
 */
export const VerifyDecisionResponseRecommendationEnum = {
    Allow: 'allow',
    Deny: 'deny',
    Review: 'review'
} as const;
export type VerifyDecisionResponseRecommendationEnum = typeof VerifyDecisionResponseRecommendationEnum[keyof typeof VerifyDecisionResponseRecommendationEnum];

/**
 * 
 * @export
 * @interface VerifyDomainResponse
 */
export interface VerifyDomainResponse {
    /**
     * The domain behind the address.
     * @type {string}
     * @memberof VerifyDomainResponse
     */
    name: string;
    /**
     * Host classification. A domain can carry more than one type.
     * @type {Array<VerifyDomainResponseTypesEnum>}
     * @memberof VerifyDomainResponse
     */
    types?: Array<VerifyDomainResponseTypesEnum> | null;
    /**
     * 0-100 domain reputation score, higher is better. Null when the domain has not been scored yet.
     * @type {number}
     * @memberof VerifyDomainResponse
     */
    score?: number | null;
    /**
     * An SPF record exists.
     * @type {boolean}
     * @memberof VerifyDomainResponse
     */
    spf?: boolean | null;
    /**
     * A DKIM record was found.
     * @type {boolean}
     * @memberof VerifyDomainResponse
     */
    dkim?: boolean | null;
    /**
     * A DMARC record exists.
     * @type {boolean}
     * @memberof VerifyDomainResponse
     */
    dmarc?: boolean | null;
    /**
     * The published DMARC policy.
     * @type {VerifyDomainResponseDmarcPolicyEnum}
     * @memberof VerifyDomainResponse
     */
    dmarc_policy?: VerifyDomainResponseDmarcPolicyEnum | null;
    /**
     * An MTA-STS policy is published.
     * @type {boolean}
     * @memberof VerifyDomainResponse
     */
    mta_sts?: boolean | null;
    /**
     * A TLS-RPT record exists.
     * @type {boolean}
     * @memberof VerifyDomainResponse
     */
    tls_rpt?: boolean | null;
    /**
     * A BIMI record exists.
     * @type {boolean}
     * @memberof VerifyDomainResponse
     */
    bimi?: boolean | null;
    /**
     * DANE/TLSA records exist for the MX hosts.
     * @type {boolean}
     * @memberof VerifyDomainResponse
     */
    dane?: boolean | null;
    /**
     * Number of public DNS blacklists currently listing this domain's mail infrastructure.
     * @type {number}
     * @memberof VerifyDomainResponse
     */
    blacklists?: number | null;
    /**
     * DNSSEC chain status.
     * @type {VerifyDomainResponseDnssecEnum}
     * @memberof VerifyDomainResponse
     */
    dnssec?: VerifyDomainResponseDnssecEnum | null;
    /**
     * A CAA record restricts which CAs may issue certificates.
     * @type {boolean}
     * @memberof VerifyDomainResponse
     */
    caa?: boolean | null;
}


/**
 * @export
 */
export const VerifyDomainResponseTypesEnum = {
    Freemail: 'freemail',
    Disposable: 'disposable',
    Custom: 'custom',
    Company: 'company',
    Government: 'government',
    Education: 'education',
    Public: 'public',
    Isp: 'isp'
} as const;
export type VerifyDomainResponseTypesEnum = typeof VerifyDomainResponseTypesEnum[keyof typeof VerifyDomainResponseTypesEnum];

/**
 * @export
 */
export const VerifyDomainResponseDmarcPolicyEnum = {
    None: 'none',
    Quarantine: 'quarantine',
    Reject: 'reject'
} as const;
export type VerifyDomainResponseDmarcPolicyEnum = typeof VerifyDomainResponseDmarcPolicyEnum[keyof typeof VerifyDomainResponseDmarcPolicyEnum];

/**
 * @export
 */
export const VerifyDomainResponseDnssecEnum = {
    Secure: 'secure',
    Insecure: 'insecure',
    Bogus: 'bogus'
} as const;
export type VerifyDomainResponseDnssecEnum = typeof VerifyDomainResponseDnssecEnum[keyof typeof VerifyDomainResponseDnssecEnum];

/**
 * 
 * @export
 * @interface VerifyJobRequest
 */
export interface VerifyJobRequest {
    /**
     * The addresses to verify. Non-empty, capped at the job limit (10000).
     * @type {Array<string>}
     * @memberof VerifyJobRequest
     */
    emails: Array<string>;
}
/**
 * 
 * @export
 * @interface VerifyJobResponse
 */
export interface VerifyJobResponse {
    /**
     * The job id. Use it to poll GET /v1/verify/jobs/{id}.
     * @type {string}
     * @memberof VerifyJobResponse
     */
    id: string;
    /**
     * Job state.
     * @type {VerifyJobResponseStatusEnum}
     * @memberof VerifyJobResponse
     */
    status: VerifyJobResponseStatusEnum;
    /**
     * Number of submitted addresses.
     * @type {number}
     * @memberof VerifyJobResponse
     */
    total: number;
    /**
     * 
     * @type {VerifyJobResponseProgress}
     * @memberof VerifyJobResponse
     */
    progress: VerifyJobResponseProgress;
    /**
     * When the job was submitted (ISO 8601).
     * @type {string}
     * @memberof VerifyJobResponse
     */
    created_at: string;
    /**
     * When the results are purged (ISO 8601, 7 days after submit).
     * @type {string}
     * @memberof VerifyJobResponse
     */
    expires_at: string;
    /**
     * One entry per submitted address, in order. Present only when status is completed. Entries are verify results, or per-item errors ({email, error}) for addresses that could not be processed.
     * @type {Array<object>}
     * @memberof VerifyJobResponse
     */
    results?: Array<object> | null;
}


/**
 * @export
 */
export const VerifyJobResponseStatusEnum = {
    Processing: 'processing',
    Completed: 'completed'
} as const;
export type VerifyJobResponseStatusEnum = typeof VerifyJobResponseStatusEnum[keyof typeof VerifyJobResponseStatusEnum];

/**
 * Processing progress.
 * @export
 * @interface VerifyJobResponseProgress
 */
export interface VerifyJobResponseProgress {
    /**
     * 
     * @type {number}
     * @memberof VerifyJobResponseProgress
     */
    total?: number;
    /**
     * 
     * @type {number}
     * @memberof VerifyJobResponseProgress
     */
    done?: number;
}
/**
 * 
 * @export
 * @interface VerifyResultResponse
 */
export interface VerifyResultResponse {
    /**
     * The address you sent.
     * @type {string}
     * @memberof VerifyResultResponse
     */
    email: string;
    /**
     * The verdict for this address.
     * @type {VerifyResultResponseResultEnum}
     * @memberof VerifyResultResponse
     */
    result: VerifyResultResponseResultEnum;
    /**
     * Proven deliverability: true only after the mailbox accepted RCPT TO, false only when the address provably fails (bad syntax, no MX, hard reject). Null means unproven, not bad: disposable, role and catch_all short-circuit before the SMTP probe.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    deliverable?: boolean | null;
    /**
     * Why the pipeline decided. greylisted, smtp_timeout, smtp_unreachable and verification_pending are transient: retry the address later. Null on results cached before reasons existed.
     * @type {VerifyResultResponseReasonEnum}
     * @memberof VerifyResultResponse
     */
    reason?: VerifyResultResponseReasonEnum | null;
    /**
     * The domain has reachable MX records.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    mx: boolean;
    /**
     * The primary MX host, when one was resolved during this check.
     * @type {string}
     * @memberof VerifyResultResponse
     */
    mx_record?: string | null;
    /**
     * Throwaway / temporary-mail provider.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    disposable: boolean;
    /**
     * Role address such as info@ or sales@.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    role: boolean;
    /**
     * Host accepts mail for any local part.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    catch_all: boolean;
    /**
     * The domain is a freemail provider (gmail.com, web.de, ...). Null when the domain is not classified yet.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    free_email?: boolean | null;
    /**
     * 0-1 confidence, higher is safer to send to.
     * @type {number}
     * @memberof VerifyResultResponse
     */
    score?: number | null;
    /**
     * How recent the underlying data is.
     * @type {VerifyResultResponseFreshnessEnum}
     * @memberof VerifyResultResponse
     */
    freshness: VerifyResultResponseFreshnessEnum;
    /**
     * When the underlying verification ran (ISO 8601). On cached results this is the original check, not the request time.
     * @type {string}
     * @memberof VerifyResultResponse
     */
    checked_at?: string | null;
    /**
     * Domain-level intelligence. Null when the domain has not been crawled yet.
     * @type {VerifyDomainResponse}
     * @memberof VerifyResultResponse
     */
    domain?: VerifyDomainResponse | null;
    /**
     * 
     * @type {VerifyDecisionResponse}
     * @memberof VerifyResultResponse
     */
    decision: VerifyDecisionResponse;
}


/**
 * @export
 */
export const VerifyResultResponseResultEnum = {
    Valid: 'valid',
    Invalid: 'invalid',
    CatchAll: 'catch_all',
    Disposable: 'disposable',
    Role: 'role',
    Unknown: 'unknown'
} as const;
export type VerifyResultResponseResultEnum = typeof VerifyResultResponseResultEnum[keyof typeof VerifyResultResponseResultEnum];

/**
 * @export
 */
export const VerifyResultResponseReasonEnum = {
    BadSyntax: 'bad_syntax',
    NoMx: 'no_mx',
    MailboxAccepts: 'mailbox_accepts',
    MailboxNotFound: 'mailbox_not_found',
    DisposableProvider: 'disposable_provider',
    RoleAddress: 'role_address',
    CatchAllDomain: 'catch_all_domain',
    Greylisted: 'greylisted',
    SmtpTimeout: 'smtp_timeout',
    SmtpUnreachable: 'smtp_unreachable',
    VerificationPending: 'verification_pending'
} as const;
export type VerifyResultResponseReasonEnum = typeof VerifyResultResponseReasonEnum[keyof typeof VerifyResultResponseReasonEnum];

/**
 * @export
 */
export const VerifyResultResponseFreshnessEnum = {
    Fresh: 'fresh',
    CachedRecent: 'cached_recent',
    CachedStaleRefreshed: 'cached_stale_refreshed'
} as const;
export type VerifyResultResponseFreshnessEnum = typeof VerifyResultResponseFreshnessEnum[keyof typeof VerifyResultResponseFreshnessEnum];

/**
 * 
 * @export
 * @interface VerifySingleRequest
 */
export interface VerifySingleRequest {
    /**
     * The address to verify.
     * @type {string}
     * @memberof VerifySingleRequest
     */
    email: string;
}
