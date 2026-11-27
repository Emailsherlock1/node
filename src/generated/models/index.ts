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
    /**
     * The X-Request-Id of this call. Sent with internal_error.
     * @type {string}
     * @memberof ApiErrorError
     */
    request_id?: string;
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
 * @interface DeliverabilityAddressResource
 */
export interface DeliverabilityAddressResource {
    /**
     * The check address id.
     * @type {number}
     * @memberof DeliverabilityAddressResource
     */
    id: number;
    /**
     * Your label for this address.
     * @type {string}
     * @memberof DeliverabilityAddressResource
     */
    label: string;
    /**
     * The full inbox address to send test messages to.
     * @type {string}
     * @memberof DeliverabilityAddressResource
     */
    address: string;
    /**
     * Whether the address currently accepts mail.
     * @type {boolean}
     * @memberof DeliverabilityAddressResource
     */
    active: boolean;
    /**
     * Whether a check.completed webhook is wired for this address.
     * @type {boolean}
     * @memberof DeliverabilityAddressResource
     */
    has_webhook: boolean;
    /**
     * 
     * @type {DeliverabilityAddressResourceLatestVerdict}
     * @memberof DeliverabilityAddressResource
     */
    latest_verdict?: DeliverabilityAddressResourceLatestVerdict | null;
    /**
     * When the address was created (ISO-8601).
     * @type {string}
     * @memberof DeliverabilityAddressResource
     */
    created_at: string;
}
/**
 * The most recent check on this address, or null if none yet. Skips messages forwarded inline, whose score describes the forwarding mailbox.
 * @export
 * @interface DeliverabilityAddressResourceLatestVerdict
 */
export interface DeliverabilityAddressResourceLatestVerdict {
    /**
     * 
     * @type {number}
     * @memberof DeliverabilityAddressResourceLatestVerdict
     */
    check_id?: number;
    /**
     * 
     * @type {number}
     * @memberof DeliverabilityAddressResourceLatestVerdict
     */
    score?: number;
    /**
     * 
     * @type {DeliverabilityAddressResourceLatestVerdictVerdictBandEnum}
     * @memberof DeliverabilityAddressResourceLatestVerdict
     */
    verdict_band?: DeliverabilityAddressResourceLatestVerdictVerdictBandEnum;
    /**
     * 
     * @type {string}
     * @memberof DeliverabilityAddressResourceLatestVerdict
     */
    received_at?: string;
}


/**
 * @export
 */
export const DeliverabilityAddressResourceLatestVerdictVerdictBandEnum = {
    InboxReady: 'inbox_ready',
    AtRisk: 'at_risk',
    LikelyFiltered: 'likely_filtered'
} as const;
export type DeliverabilityAddressResourceLatestVerdictVerdictBandEnum = typeof DeliverabilityAddressResourceLatestVerdictVerdictBandEnum[keyof typeof DeliverabilityAddressResourceLatestVerdictVerdictBandEnum];

/**
 * 
 * @export
 * @interface DeliverabilityCheckResource
 */
export interface DeliverabilityCheckResource {
    /**
     * The check id.
     * @type {number}
     * @memberof DeliverabilityCheckResource
     */
    id: number;
    /**
     * The check address this belongs to.
     * @type {number}
     * @memberof DeliverabilityCheckResource
     */
    address_id: number;
    /**
     * The customer label of the address.
     * @type {string}
     * @memberof DeliverabilityCheckResource
     */
    address_label: string;
    /**
     * The address record this check belongs to, rendered on the current inbound host. The host the message actually arrived on is not stored, so a check from before an inbound-host move reads with the current host.
     * @type {string}
     * @memberof DeliverabilityCheckResource
     */
    address: string;
    /**
     * When the message arrived (ISO-8601).
     * @type {string}
     * @memberof DeliverabilityCheckResource
     */
    received_at: string;
    /**
     * Envelope/header From address.
     * @type {string}
     * @memberof DeliverabilityCheckResource
     */
    from?: string | null;
    /**
     * Sending domain.
     * @type {string}
     * @memberof DeliverabilityCheckResource
     */
    from_domain?: string | null;
    /**
     * Message subject.
     * @type {string}
     * @memberof DeliverabilityCheckResource
     */
    subject?: string | null;
    /**
     * The IP the message was sent from.
     * @type {string}
     * @memberof DeliverabilityCheckResource
     */
    sending_ip?: string | null;
    /**
     * RFC 5322 Message-ID of the audited message.
     * @type {string}
     * @memberof DeliverabilityCheckResource
     */
    message_id?: string | null;
    /**
     * Transparent 0-100 deliverability score.
     * @type {number}
     * @memberof DeliverabilityCheckResource
     */
    score: number;
    /**
     * Verdict band derived from the score.
     * @type {DeliverabilityCheckResourceVerdictBandEnum}
     * @memberof DeliverabilityCheckResource
     */
    verdict_band: DeliverabilityCheckResourceVerdictBandEnum;
    /**
     * True when the message was forwarded inline (pasted into a new mail) rather than as an attachment. The original headers are gone, so `score` and `verdict_band` describe the mailbox of whoever forwarded it, not the original sender. The latest-verdict gate and the `latest_verdict` of the address list skip such checks.
     * @type {boolean}
     * @memberof DeliverabilityCheckResource
     */
    forwarded_inline: boolean;
}


/**
 * @export
 */
export const DeliverabilityCheckResourceVerdictBandEnum = {
    InboxReady: 'inbox_ready',
    AtRisk: 'at_risk',
    LikelyFiltered: 'likely_filtered'
} as const;
export type DeliverabilityCheckResourceVerdictBandEnum = typeof DeliverabilityCheckResourceVerdictBandEnum[keyof typeof DeliverabilityCheckResourceVerdictBandEnum];

/**
 * 
 * @export
 * @interface DeliverabilityLatestVerdictResource
 */
export interface DeliverabilityLatestVerdictResource {
    /**
     * The check address id.
     * @type {number}
     * @memberof DeliverabilityLatestVerdictResource
     */
    address_id: number;
    /**
     * Whether a check that read the original sender has been logged for this address yet. A message forwarded inline does not count: its headers are those of the forwarding mailbox.
     * @type {boolean}
     * @memberof DeliverabilityLatestVerdictResource
     */
    has_result: boolean;
    /**
     * 
     * @type {DeliverabilityLatestVerdictResourceVerdict}
     * @memberof DeliverabilityLatestVerdictResource
     */
    verdict?: DeliverabilityLatestVerdictResourceVerdict | null;
}
/**
 * The latest verdict, or null when no check that read the original sender has been logged yet. Skips messages forwarded inline, so this can be older than the newest entry in the check log.
 * @export
 * @interface DeliverabilityLatestVerdictResourceVerdict
 */
export interface DeliverabilityLatestVerdictResourceVerdict {
    /**
     * 
     * @type {number}
     * @memberof DeliverabilityLatestVerdictResourceVerdict
     */
    check_id?: number;
    /**
     * 
     * @type {number}
     * @memberof DeliverabilityLatestVerdictResourceVerdict
     */
    score?: number;
    /**
     * 
     * @type {DeliverabilityLatestVerdictResourceVerdictVerdictBandEnum}
     * @memberof DeliverabilityLatestVerdictResourceVerdict
     */
    verdict_band?: DeliverabilityLatestVerdictResourceVerdictVerdictBandEnum;
    /**
     * 
     * @type {string}
     * @memberof DeliverabilityLatestVerdictResourceVerdict
     */
    received_at?: string;
    /**
     * 
     * @type {string}
     * @memberof DeliverabilityLatestVerdictResourceVerdict
     */
    from_domain?: string | null;
    /**
     * 
     * @type {string}
     * @memberof DeliverabilityLatestVerdictResourceVerdict
     */
    message_id?: string | null;
}


/**
 * @export
 */
export const DeliverabilityLatestVerdictResourceVerdictVerdictBandEnum = {
    InboxReady: 'inbox_ready',
    AtRisk: 'at_risk',
    LikelyFiltered: 'likely_filtered'
} as const;
export type DeliverabilityLatestVerdictResourceVerdictVerdictBandEnum = typeof DeliverabilityLatestVerdictResourceVerdictVerdictBandEnum[keyof typeof DeliverabilityLatestVerdictResourceVerdictVerdictBandEnum];

/**
 * 
 * @export
 * @interface DeliverabilityWebhookResource
 */
export interface DeliverabilityWebhookResource {
    /**
     * The check address the webhook belongs to.
     * @type {number}
     * @memberof DeliverabilityWebhookResource
     */
    address_id: number;
    /**
     * 
     * @type {DeliverabilityWebhookResourceWebhook}
     * @memberof DeliverabilityWebhookResource
     */
    webhook?: DeliverabilityWebhookResourceWebhook | null;
}
/**
 * The configured webhook, or null after a DELETE.
 * @export
 * @interface DeliverabilityWebhookResourceWebhook
 */
export interface DeliverabilityWebhookResourceWebhook {
    /**
     * The https endpoint check.completed is POSTed to.
     * @type {string}
     * @memberof DeliverabilityWebhookResourceWebhook
     */
    url?: string;
    /**
     * The HMAC-SHA256 signing secret. Shown once, on create/rotate. Verify X-EmailSherlock-Signature with it.
     * @type {string}
     * @memberof DeliverabilityWebhookResourceWebhook
     */
    secret?: string;
}
/**
 * 
 * @export
 * @interface DmarcReportResource
 */
export interface DmarcReportResource {
    /**
     * Our id for this report.
     * @type {number}
     * @memberof DmarcReportResource
     */
    id: number;
    /**
     * The organisation that sent the report.
     * @type {string}
     * @memberof DmarcReportResource
     */
    reporter: string;
    /**
     * The id the reporter gave the report.
     * @type {string}
     * @memberof DmarcReportResource
     */
    report_id: string;
    /**
     * Start of the period the report covers.
     * @type {string}
     * @memberof DmarcReportResource
     */
    date_begin: string;
    /**
     * End of the period the report covers.
     * @type {string}
     * @memberof DmarcReportResource
     */
    date_end: string;
    /**
     * 
     * @type {DmarcReportResourcePolicy}
     * @memberof DmarcReportResource
     */
    policy: DmarcReportResourcePolicy;
    /**
     * Messages this report counted.
     * @type {number}
     * @memberof DmarcReportResource
     */
    message_count: number;
    /**
     * Messages where neither SPF nor DKIM aligned.
     * @type {number}
     * @memberof DmarcReportResource
     */
    failing_count: number;
}
/**
 * The policy the reporter read in your DMARC record.
 * @export
 * @interface DmarcReportResourcePolicy
 */
export interface DmarcReportResourcePolicy {
    /**
     * 
     * @type {string}
     * @memberof DmarcReportResourcePolicy
     */
    p?: string;
    /**
     * 
     * @type {string}
     * @memberof DmarcReportResourcePolicy
     */
    sp?: string | null;
    /**
     * 
     * @type {number}
     * @memberof DmarcReportResourcePolicy
     */
    pct?: number | null;
}
/**
 * 
 * @export
 * @interface DmarcSetupResource
 */
export interface DmarcSetupResource {
    /**
     * 
     * @type {string}
     * @memberof DmarcSetupResource
     */
    domain: string;
    /**
     * found: the DMARC record carries your report address. not_found: the domain publishes no DMARC record of its own (a subdomain that only inherits the record of its parent domain counts here, and the record to publish is its own). wrong_record: it publishes one without your report address. unknown: we could not look the record up just now (the lookup did not finish, or on start your account has used its checks for this hour), ask again later.
     * @type {DmarcSetupResourceStatusEnum}
     * @memberof DmarcSetupResource
     */
    status: DmarcSetupResourceStatusEnum;
    /**
     * Whether the record confirms the domain as yours. Once true, your account reads the domain's DMARC reports.
     * @type {boolean}
     * @memberof DmarcSetupResource
     */
    confirmed: boolean;
    /**
     * 
     * @type {DmarcSetupResourceRecord}
     * @memberof DmarcSetupResource
     */
    record?: DmarcSetupResourceRecord | null;
    /**
     * 
     * @type {DmarcSetupResourceDnsProvider}
     * @memberof DmarcSetupResource
     */
    dns_provider?: DmarcSetupResourceDnsProvider | null;
    /**
     * 
     * @type {DmarcSetupResourceWatchSlots}
     * @memberof DmarcSetupResource
     */
    watch_slots: DmarcSetupResourceWatchSlots;
}


/**
 * @export
 */
export const DmarcSetupResourceStatusEnum = {
    Found: 'found',
    NotFound: 'not_found',
    WrongRecord: 'wrong_record',
    Unknown: 'unknown'
} as const;
export type DmarcSetupResourceStatusEnum = typeof DmarcSetupResourceStatusEnum[keyof typeof DmarcSetupResourceStatusEnum];

/**
 * Where the domain's DNS is edited, from its nameservers. Null when we hold no nameservers for the domain yet.
 * @export
 * @interface DmarcSetupResourceDnsProvider
 */
export interface DmarcSetupResourceDnsProvider {
    /**
     * The company that runs the nameservers, or null when we cannot name it.
     * @type {string}
     * @memberof DmarcSetupResourceDnsProvider
     */
    name?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof DmarcSetupResourceDnsProvider
     */
    nameservers?: Array<string>;
}
/**
 * The one change to make in the domain's DNS. Null when the record is live and its report addresses parse, and when status is unknown: we hand out a record only on a fresh lookup.
 * @export
 * @interface DmarcSetupResourceRecord
 */
export interface DmarcSetupResourceRecord {
    /**
     * The DNS name the record lives at.
     * @type {string}
     * @memberof DmarcSetupResourceRecord
     */
    host?: string;
    /**
     * 
     * @type {DmarcSetupResourceRecordTypeEnum}
     * @memberof DmarcSetupResourceRecord
     */
    type?: DmarcSetupResourceRecordTypeEnum;
    /**
     * What to publish. For add_address, only the address to add to the record's rua tag.
     * @type {string}
     * @memberof DmarcSetupResourceRecord
     */
    value?: string;
    /**
     * create: add a new TXT record. replace: change the existing record into value, keeping everything else in it. add_address: add value to the rua tag of the existing record.
     * @type {DmarcSetupResourceRecordActionEnum}
     * @memberof DmarcSetupResourceRecord
     */
    action?: DmarcSetupResourceRecordActionEnum;
    /**
     * The record the domain publishes today, for replace. Null otherwise.
     * @type {string}
     * @memberof DmarcSetupResourceRecord
     */
    current?: string | null;
    /**
     * For a subdomain taking over the record of its parent: the DNS name each external report address in value has to answer so its reports keep arriving, at that receiver or as a wildcard entry there. Empty when value names no external address.
     * @type {Array<string>}
     * @memberof DmarcSetupResourceRecord
     */
    report_authorization_names?: Array<string>;
}


/**
 * @export
 */
export const DmarcSetupResourceRecordTypeEnum = {
    Txt: 'TXT'
} as const;
export type DmarcSetupResourceRecordTypeEnum = typeof DmarcSetupResourceRecordTypeEnum[keyof typeof DmarcSetupResourceRecordTypeEnum];

/**
 * @export
 */
export const DmarcSetupResourceRecordActionEnum = {
    Create: 'create',
    Replace: 'replace',
    AddAddress: 'add_address'
} as const;
export type DmarcSetupResourceRecordActionEnum = typeof DmarcSetupResourceRecordActionEnum[keyof typeof DmarcSetupResourceRecordActionEnum];

/**
 * How many domains your account watches, and how many your plan allows (null: no limit).
 * @export
 * @interface DmarcSetupResourceWatchSlots
 */
export interface DmarcSetupResourceWatchSlots {
    /**
     * 
     * @type {number}
     * @memberof DmarcSetupResourceWatchSlots
     */
    used?: number;
    /**
     * 
     * @type {number}
     * @memberof DmarcSetupResourceWatchSlots
     */
    max?: number | null;
}
/**
 * 
 * @export
 * @interface DmarcSourceResource
 */
export interface DmarcSourceResource {
    /**
     * The name of this source, as the dashboard shows it.
     * @type {string}
     * @memberof DmarcSourceResource
     */
    label: string;
    /**
     * Whether we could name the source.
     * @type {DmarcSourceResourceKindEnum}
     * @memberof DmarcSourceResource
     */
    kind: DmarcSourceResourceKindEnum;
    /**
     * legit: most of this source's mail passed DMARC. fix: most did not, but the source authenticates as a sender of its own. susp: most did not, and nothing ties the source to a sender.
     * @type {DmarcSourceResourceStatusEnum}
     * @memberof DmarcSourceResource
     */
    status: DmarcSourceResourceStatusEnum;
    /**
     * The section of the senders table this row sits in.
     * @type {DmarcSourceResourceSectionEnum}
     * @memberof DmarcSourceResource
     */
    section: DmarcSourceResourceSectionEnum;
    /**
     * Messages from this source in the range.
     * @type {number}
     * @memberof DmarcSourceResource
     */
    message_count: number;
    /**
     * Of those, the messages that passed DMARC.
     * @type {number}
     * @memberof DmarcSourceResource
     */
    aligned_messages: number;
    /**
     * Source addresses folded into this row.
     * @type {number}
     * @memberof DmarcSourceResource
     */
    address_count: number;
    /**
     * The source addresses of this row.
     * @type {Array<string>}
     * @memberof DmarcSourceResource
     */
    ips: Array<string>;
    /**
     * The network, when all addresses share one.
     * @type {number}
     * @memberof DmarcSourceResource
     */
    asn: number | null;
    /**
     * The name of that network.
     * @type {string}
     * @memberof DmarcSourceResource
     */
    asn_name: string | null;
    /**
     * The country, when all addresses share one.
     * @type {string}
     * @memberof DmarcSourceResource
     */
    country: string | null;
    /**
     * Whether we first saw this source in the last 7 days.
     * @type {boolean}
     * @memberof DmarcSourceResource
     */
    is_new: boolean;
    /**
     * Monitor Premium only. Messages that passed SPF in alignment.
     * @type {number}
     * @memberof DmarcSourceResource
     */
    spf_aligned_messages: number;
    /**
     * Monitor Premium only. Messages that passed DKIM in alignment.
     * @type {number}
     * @memberof DmarcSourceResource
     */
    dkim_aligned_messages: number;
    /**
     * 
     * @type {DmarcSourceResourceDispositions}
     * @memberof DmarcSourceResource
     */
    dispositions: DmarcSourceResourceDispositions;
}


/**
 * @export
 */
export const DmarcSourceResourceKindEnum = {
    Known: 'known',
    Unknown: 'unknown'
} as const;
export type DmarcSourceResourceKindEnum = typeof DmarcSourceResourceKindEnum[keyof typeof DmarcSourceResourceKindEnum];

/**
 * @export
 */
export const DmarcSourceResourceStatusEnum = {
    Legit: 'legit',
    Fix: 'fix',
    Susp: 'susp'
} as const;
export type DmarcSourceResourceStatusEnum = typeof DmarcSourceResourceStatusEnum[keyof typeof DmarcSourceResourceStatusEnum];

/**
 * @export
 */
export const DmarcSourceResourceSectionEnum = {
    Fix: 'fix',
    Susp: 'susp',
    Legit: 'legit',
    Forwarded: 'forwarded'
} as const;
export type DmarcSourceResourceSectionEnum = typeof DmarcSourceResourceSectionEnum[keyof typeof DmarcSourceResourceSectionEnum];

/**
 * Monitor Premium only. What receivers did with the messages that failed DMARC. Passed mail is not counted here.
 * @export
 * @interface DmarcSourceResourceDispositions
 */
export interface DmarcSourceResourceDispositions {
    /**
     * 
     * @type {number}
     * @memberof DmarcSourceResourceDispositions
     */
    none?: number;
    /**
     * 
     * @type {number}
     * @memberof DmarcSourceResourceDispositions
     */
    quarantine?: number;
    /**
     * 
     * @type {number}
     * @memberof DmarcSourceResourceDispositions
     */
    reject?: number;
}
/**
 * 
 * @export
 * @interface DmarcSummaryResource
 */
export interface DmarcSummaryResource {
    /**
     * 
     * @type {string}
     * @memberof DmarcSummaryResource
     */
    domain: string;
    /**
     * The days this summary covers.
     * @type {DmarcSummaryResourceRangeDaysEnum}
     * @memberof DmarcSummaryResource
     */
    range_days: DmarcSummaryResourceRangeDaysEnum;
    /**
     * Messages the reports counted in the range.
     * @type {number}
     * @memberof DmarcSummaryResource
     */
    message_count: number;
    /**
     * Messages that passed DMARC.
     * @type {number}
     * @memberof DmarcSummaryResource
     */
    aligned_messages: number;
    /**
     * Share of messages that passed DMARC, or null without messages.
     * @type {number}
     * @memberof DmarcSummaryResource
     */
    aligned_pct?: number | null;
    /**
     * Source addresses seen in the range.
     * @type {number}
     * @memberof DmarcSummaryResource
     */
    source_count: number;
    /**
     * Source addresses we could name.
     * @type {number}
     * @memberof DmarcSummaryResource
     */
    known_source_count: number;
    /**
     * Source addresses we could not name.
     * @type {number}
     * @memberof DmarcSummaryResource
     */
    unknown_source_count: number;
    /**
     * Source addresses first seen in the last 7 days.
     * @type {number}
     * @memberof DmarcSummaryResource
     */
    new_source_count: number;
    /**
     * Source addresses whose mail mostly failed DMARC.
     * @type {number}
     * @memberof DmarcSummaryResource
     */
    failing_source_count: number;
    /**
     * When the latest report arrived, or null if none has.
     * @type {string}
     * @memberof DmarcSummaryResource
     */
    last_received_at?: string | null;
    /**
     * 
     * @type {DmarcSummaryResourceReportedPolicy}
     * @memberof DmarcSummaryResource
     */
    reported_policy?: DmarcSummaryResourceReportedPolicy | null;
}


/**
 * @export
 */
export const DmarcSummaryResourceRangeDaysEnum = {
    NUMBER_7: 7,
    NUMBER_30: 30
} as const;
export type DmarcSummaryResourceRangeDaysEnum = typeof DmarcSummaryResourceRangeDaysEnum[keyof typeof DmarcSummaryResourceRangeDaysEnum];

/**
 * The policy the latest report quotes, or null without a report.
 * @export
 * @interface DmarcSummaryResourceReportedPolicy
 */
export interface DmarcSummaryResourceReportedPolicy {
    /**
     * 
     * @type {string}
     * @memberof DmarcSummaryResourceReportedPolicy
     */
    p?: string;
    /**
     * 
     * @type {string}
     * @memberof DmarcSummaryResourceReportedPolicy
     */
    sp?: string | null;
    /**
     * 
     * @type {number}
     * @memberof DmarcSummaryResourceReportedPolicy
     */
    pct?: number | null;
}
/**
 * 
 * @export
 * @interface DomainChangeResource
 */
export interface DomainChangeResource {
    /**
     * A stable machine-readable name for this kind of change.
     * @type {string}
     * @memberof DomainChangeResource
     */
    type: string;
    /**
     * The area of the change, as the timeline labels it.
     * @type {string}
     * @memberof DomainChangeResource
     */
    tag: string;
    /**
     * The timeline headline.
     * @type {string}
     * @memberof DomainChangeResource
     */
    title: string;
    /**
     * The timeline text. Can be empty.
     * @type {string}
     * @memberof DomainChangeResource
     */
    description: string;
    /**
     * When we recorded the change.
     * @type {string}
     * @memberof DomainChangeResource
     */
    created_at: string;
    /**
     * 
     * @type {DomainChangeResourceChanges}
     * @memberof DomainChangeResource
     */
    changes?: DomainChangeResourceChanges | null;
}
/**
 * The records added and removed, on a DNS change. Null on every other row.
 * @export
 * @interface DomainChangeResourceChanges
 */
export interface DomainChangeResourceChanges {
    /**
     * 
     * @type {Array<object>}
     * @memberof DomainChangeResourceChanges
     */
    added?: Array<object>;
    /**
     * 
     * @type {Array<object>}
     * @memberof DomainChangeResourceChanges
     */
    removed?: Array<object>;
    /**
     * 
     * @type {number}
     * @memberof DomainChangeResourceChanges
     */
    added_count?: number;
    /**
     * 
     * @type {number}
     * @memberof DomainChangeResourceChanges
     */
    removed_count?: number;
}
/**
 * 
 * @export
 * @interface GetCheck200Response
 */
export interface GetCheck200Response {
    /**
     * The check id.
     * @type {number}
     * @memberof GetCheck200Response
     */
    id: number;
    /**
     * The check address this belongs to.
     * @type {number}
     * @memberof GetCheck200Response
     */
    address_id: number;
    /**
     * The customer label of the address.
     * @type {string}
     * @memberof GetCheck200Response
     */
    address_label: string;
    /**
     * The address record this check belongs to, rendered on the current inbound host. The host the message actually arrived on is not stored, so a check from before an inbound-host move reads with the current host.
     * @type {string}
     * @memberof GetCheck200Response
     */
    address: string;
    /**
     * When the message arrived (ISO-8601).
     * @type {string}
     * @memberof GetCheck200Response
     */
    received_at: string;
    /**
     * Envelope/header From address.
     * @type {string}
     * @memberof GetCheck200Response
     */
    from?: string | null;
    /**
     * Sending domain.
     * @type {string}
     * @memberof GetCheck200Response
     */
    from_domain?: string | null;
    /**
     * Message subject.
     * @type {string}
     * @memberof GetCheck200Response
     */
    subject?: string | null;
    /**
     * The IP the message was sent from.
     * @type {string}
     * @memberof GetCheck200Response
     */
    sending_ip?: string | null;
    /**
     * RFC 5322 Message-ID of the audited message.
     * @type {string}
     * @memberof GetCheck200Response
     */
    message_id?: string | null;
    /**
     * Transparent 0-100 deliverability score.
     * @type {number}
     * @memberof GetCheck200Response
     */
    score: number;
    /**
     * Verdict band derived from the score.
     * @type {GetCheck200ResponseVerdictBandEnum}
     * @memberof GetCheck200Response
     */
    verdict_band: GetCheck200ResponseVerdictBandEnum;
    /**
     * True when the message was forwarded inline (pasted into a new mail) rather than as an attachment. The original headers are gone, so `score` and `verdict_band` describe the mailbox of whoever forwarded it, not the original sender. The latest-verdict gate and the `latest_verdict` of the address list skip such checks.
     * @type {boolean}
     * @memberof GetCheck200Response
     */
    forwarded_inline: boolean;
    /**
     * The full audit breakdown, frozen at check time. Additive; new fields may appear.
     * @type {object}
     * @memberof GetCheck200Response
     */
    result?: object;
}


/**
 * @export
 */
export const GetCheck200ResponseVerdictBandEnum = {
    InboxReady: 'inbox_ready',
    AtRisk: 'at_risk',
    LikelyFiltered: 'likely_filtered'
} as const;
export type GetCheck200ResponseVerdictBandEnum = typeof GetCheck200ResponseVerdictBandEnum[keyof typeof GetCheck200ResponseVerdictBandEnum];

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
 * @interface ImpersonationAnalyzeRequest
 */
export interface ImpersonationAnalyzeRequest {
    /**
     * The From address, the bare local@domain without display name or angle brackets, with at most 64 octets before the @, 254 in total, and a domain within the DNS limits (63 octets a label, 253 the name).
     * @type {string}
     * @memberof ImpersonationAnalyzeRequest
     */
    from: string;
    /**
     * The From display name as the reader sees it, at most 20 words.
     * @type {string}
     * @memberof ImpersonationAnalyzeRequest
     */
    display_name?: string | null;
    /**
     * The Reply-To address, when the message has one. A value that is not of the form local@domain, or over the same length limits as from, is ignored.
     * @type {string}
     * @memberof ImpersonationAnalyzeRequest
     */
    reply_to?: string | null;
    /**
     * The DMARC result your mail server recorded for the From domain, the word from the Authentication-Results header. Only fail counts: a pass does not lower the score, and any other word (pass, none, temperror, permerror, or a receiver-specific one such as Microsoft's bestguesspass) is read as no stated result.
     * @type {string}
     * @memberof ImpersonationAnalyzeRequest
     */
    dmarc?: string | null;
    /**
     * The people and organisations a sender may pose as: executives, suppliers, partners. At most 50 per call. List the domains and addresses each one really sends from; without them, genuine mail from that identity scores like a forgery.
     * @type {Array<ImpersonationAnalyzeRequestProtectedInner>}
     * @memberof ImpersonationAnalyzeRequest
     */
    _protected: Array<ImpersonationAnalyzeRequestProtectedInner>;
}
/**
 * 
 * @export
 * @interface ImpersonationAnalyzeRequestProtectedInner
 */
export interface ImpersonationAnalyzeRequestProtectedInner {
    /**
     * How the identity appears in a display name, at most 10 words.
     * @type {string}
     * @memberof ImpersonationAnalyzeRequestProtectedInner
     */
    name: string;
    /**
     * Domains this identity sends from. A sender on a subdomain counts as the identity too.
     * @type {Array<string>}
     * @memberof ImpersonationAnalyzeRequestProtectedInner
     */
    domains?: Array<string>;
    /**
     * Exact addresses this identity sends from, for a mailbox outside its domains.
     * @type {Array<string>}
     * @memberof ImpersonationAnalyzeRequestProtectedInner
     */
    addresses?: Array<string>;
}
/**
 * 
 * @export
 * @interface ImpersonationAnalyzeResponse
 */
export interface ImpersonationAnalyzeResponse {
    /**
     * How strongly the sender poses as one of your protected identities. none means none of our signals fired, not that the sender is safe.
     * @type {ImpersonationAnalyzeResponseRiskEnum}
     * @memberof ImpersonationAnalyzeResponse
     */
    risk: ImpersonationAnalyzeResponseRiskEnum;
    /**
     * The sum of the reason weights, capped at 100. Read it as 60 / 100, not as a probability. medium starts at 35, high at 60.
     * @type {number}
     * @memberof ImpersonationAnalyzeResponse
     */
    score: number;
    /**
     * The name of the protected identity the sender poses as, or null when the risk is none.
     * @type {string}
     * @memberof ImpersonationAnalyzeResponse
     */
    identity?: string | null;
    /**
     * Why the score is what it is, heaviest first. Empty when the risk is none.
     * @type {Array<ImpersonationAnalyzeResponseReasonsInner>}
     * @memberof ImpersonationAnalyzeResponse
     */
    reasons: Array<ImpersonationAnalyzeResponseReasonsInner>;
}


/**
 * @export
 */
export const ImpersonationAnalyzeResponseRiskEnum = {
    None: 'none',
    Low: 'low',
    Medium: 'medium',
    High: 'high'
} as const;
export type ImpersonationAnalyzeResponseRiskEnum = typeof ImpersonationAnalyzeResponseRiskEnum[keyof typeof ImpersonationAnalyzeResponseRiskEnum];

/**
 * 
 * @export
 * @interface ImpersonationAnalyzeResponseReasonsInner
 */
export interface ImpersonationAnalyzeResponseReasonsInner {
    /**
     * Stable identifier to branch on.
     * @type {ImpersonationAnalyzeResponseReasonsInnerReasonEnum}
     * @memberof ImpersonationAnalyzeResponseReasonsInner
     */
    reason?: ImpersonationAnalyzeResponseReasonsInnerReasonEnum;
    /**
     * What this reason adds to the score.
     * @type {number}
     * @memberof ImpersonationAnalyzeResponseReasonsInner
     */
    weight?: number;
    /**
     * The one value the reason is about: the matched display name, the imitated domain, the domain age in days. Domains are lowercase, an IDN in Punycode.
     * @type {string}
     * @memberof ImpersonationAnalyzeResponseReasonsInner
     */
    detail?: string | null;
}


/**
 * @export
 */
export const ImpersonationAnalyzeResponseReasonsInnerReasonEnum = {
    DisplayName: 'display_name',
    DisplayNameConfusable: 'display_name_confusable',
    NameInAddress: 'name_in_address',
    LookalikeDomain: 'lookalike_domain',
    ForgedProtectedDomain: 'forged_protected_domain',
    FreemailSender: 'freemail_sender',
    DisposableSender: 'disposable_sender',
    NewDomain: 'new_domain',
    NoMx: 'no_mx',
    DomainBlocked: 'domain_blocked',
    DomainListed: 'domain_listed',
    ReplyElsewhere: 'reply_elsewhere'
} as const;
export type ImpersonationAnalyzeResponseReasonsInnerReasonEnum = typeof ImpersonationAnalyzeResponseReasonsInnerReasonEnum[keyof typeof ImpersonationAnalyzeResponseReasonsInnerReasonEnum];

/**
 * 
 * @export
 * @interface ListCheckAddresses200Response
 */
export interface ListCheckAddresses200Response {
    /**
     * 
     * @type {Array<DeliverabilityAddressResource>}
     * @memberof ListCheckAddresses200Response
     */
    addresses?: Array<DeliverabilityAddressResource>;
}
/**
 * 
 * @export
 * @interface ListChecks200Response
 */
export interface ListChecks200Response {
    /**
     * 
     * @type {number}
     * @memberof ListChecks200Response
     */
    address_id?: number;
    /**
     * 
     * @type {number}
     * @memberof ListChecks200Response
     */
    limit?: number;
    /**
     * 
     * @type {number}
     * @memberof ListChecks200Response
     */
    offset?: number;
    /**
     * How many rows this page returned.
     * @type {number}
     * @memberof ListChecks200Response
     */
    count?: number;
    /**
     * 
     * @type {Array<DeliverabilityCheckResource>}
     * @memberof ListChecks200Response
     */
    checks?: Array<DeliverabilityCheckResource>;
}
/**
 * 
 * @export
 * @interface ListDmarcReports200Response
 */
export interface ListDmarcReports200Response {
    /**
     * 
     * @type {string}
     * @memberof ListDmarcReports200Response
     */
    domain?: string;
    /**
     * The earliest moment this list reaches back to (30 days without Monitor Premium on this domain), or null when it covers every stored row.
     * @type {string}
     * @memberof ListDmarcReports200Response
     */
    history_from?: string | null;
    /**
     * 
     * @type {number}
     * @memberof ListDmarcReports200Response
     */
    limit?: number;
    /**
     * 
     * @type {number}
     * @memberof ListDmarcReports200Response
     */
    offset?: number;
    /**
     * How many rows this page returned.
     * @type {number}
     * @memberof ListDmarcReports200Response
     */
    count?: number;
    /**
     * The offset of the next page. Null on the last page, and past the offset limit of 100000.
     * @type {number}
     * @memberof ListDmarcReports200Response
     */
    next_offset?: number | null;
    /**
     * 
     * @type {Array<DmarcReportResource>}
     * @memberof ListDmarcReports200Response
     */
    reports?: Array<DmarcReportResource>;
}
/**
 * 
 * @export
 * @interface ListDmarcSources200Response
 */
export interface ListDmarcSources200Response {
    /**
     * 
     * @type {string}
     * @memberof ListDmarcSources200Response
     */
    domain?: string;
    /**
     * 
     * @type {number}
     * @memberof ListDmarcSources200Response
     */
    range_days?: number;
    /**
     * 
     * @type {number}
     * @memberof ListDmarcSources200Response
     */
    limit?: number;
    /**
     * 
     * @type {number}
     * @memberof ListDmarcSources200Response
     */
    offset?: number;
    /**
     * How many rows this page returned.
     * @type {number}
     * @memberof ListDmarcSources200Response
     */
    count?: number;
    /**
     * The offset of the next page. Null on the last page, and past the offset limit of 100000.
     * @type {number}
     * @memberof ListDmarcSources200Response
     */
    next_offset?: number | null;
    /**
     * 
     * @type {Array<DmarcSourceResource>}
     * @memberof ListDmarcSources200Response
     */
    sources?: Array<DmarcSourceResource>;
}
/**
 * 
 * @export
 * @interface ListDomainChanges200Response
 */
export interface ListDomainChanges200Response {
    /**
     * 
     * @type {string}
     * @memberof ListDomainChanges200Response
     */
    domain?: string;
    /**
     * The earliest moment this list reaches back to (30 days without Monitor Premium on this domain), or null when it covers every stored row.
     * @type {string}
     * @memberof ListDomainChanges200Response
     */
    history_from?: string | null;
    /**
     * 
     * @type {number}
     * @memberof ListDomainChanges200Response
     */
    limit?: number;
    /**
     * 
     * @type {number}
     * @memberof ListDomainChanges200Response
     */
    offset?: number;
    /**
     * How many rows this page returned.
     * @type {number}
     * @memberof ListDomainChanges200Response
     */
    count?: number;
    /**
     * The offset of the next page. Null on the last page, and past the offset limit of 100000.
     * @type {number}
     * @memberof ListDomainChanges200Response
     */
    next_offset?: number | null;
    /**
     * 
     * @type {Array<DomainChangeResource>}
     * @memberof ListDomainChanges200Response
     */
    changes?: Array<DomainChangeResource>;
}
/**
 * 
 * @export
 * @interface ListTlsRptReports200Response
 */
export interface ListTlsRptReports200Response {
    /**
     * 
     * @type {string}
     * @memberof ListTlsRptReports200Response
     */
    domain?: string;
    /**
     * 
     * @type {number}
     * @memberof ListTlsRptReports200Response
     */
    range_days?: number;
    /**
     * 
     * @type {number}
     * @memberof ListTlsRptReports200Response
     */
    limit?: number;
    /**
     * 
     * @type {number}
     * @memberof ListTlsRptReports200Response
     */
    offset?: number;
    /**
     * How many rows this page returned.
     * @type {number}
     * @memberof ListTlsRptReports200Response
     */
    count?: number;
    /**
     * The offset of the next page. Null on the last page, and past the offset limit of 100000.
     * @type {number}
     * @memberof ListTlsRptReports200Response
     */
    next_offset?: number | null;
    /**
     * 
     * @type {Array<TlsRptReportResource>}
     * @memberof ListTlsRptReports200Response
     */
    reports?: Array<TlsRptReportResource>;
}
/**
 * 
 * @export
 * @interface NextStepsResource
 */
export interface NextStepsResource {
    /**
     * 
     * @type {string}
     * @memberof NextStepsResource
     */
    domain: string;
    /**
     * 
     * @type {NextStepsResourcePolicy}
     * @memberof NextStepsResource
     */
    policy: NextStepsResourcePolicy;
    /**
     * 
     * @type {NextStepsResourceLadder}
     * @memberof NextStepsResource
     */
    ladder?: NextStepsResourceLadder | null;
    /**
     * The sources that keep the domain from the next policy, one per sending group, in the order the DMARC dashboard lists them.
     * @type {Array<NextStepsResourceUnalignedSourcesInner>}
     * @memberof NextStepsResource
     */
    unaligned_sources: Array<NextStepsResourceUnalignedSourcesInner>;
    /**
     * The Fix Guide scan's open findings for the domain, worst first.
     * @type {Array<NextStepsResourceFindingsInner>}
     * @memberof NextStepsResource
     */
    findings: Array<NextStepsResourceFindingsInner>;
}
/**
 * 
 * @export
 * @interface NextStepsResourceFindingsInner
 */
export interface NextStepsResourceFindingsInner {
    /**
     * 
     * @type {string}
     * @memberof NextStepsResourceFindingsInner
     */
    key?: string;
    /**
     * 
     * @type {string}
     * @memberof NextStepsResourceFindingsInner
     */
    label?: string;
}
/**
 * The five steps from monitoring to p=reject, as the dashboard shows them. Null at p=reject, and when the published policy cannot be read.
 * @export
 * @interface NextStepsResourceLadder
 */
export interface NextStepsResourceLadder {
    /**
     * 
     * @type {number}
     * @memberof NextStepsResourceLadder
     */
    done?: number;
    /**
     * 
     * @type {number}
     * @memberof NextStepsResourceLadder
     */
    total?: number;
    /**
     * 
     * @type {NextStepsResourceLadderNextPolicyEnum}
     * @memberof NextStepsResourceLadder
     */
    next_policy?: NextStepsResourceLadderNextPolicyEnum;
    /**
     * True only while reports keep arriving, enough mail has been observed and no source that authenticates for the domain falls short of DMARC.
     * @type {boolean}
     * @memberof NextStepsResourceLadder
     */
    ready_for_next_policy?: boolean;
    /**
     * 
     * @type {Array<NextStepsResourceLadderStepsInner>}
     * @memberof NextStepsResourceLadder
     */
    steps?: Array<NextStepsResourceLadderStepsInner>;
}


/**
 * @export
 */
export const NextStepsResourceLadderNextPolicyEnum = {
    Quarantine: 'quarantine',
    Reject: 'reject'
} as const;
export type NextStepsResourceLadderNextPolicyEnum = typeof NextStepsResourceLadderNextPolicyEnum[keyof typeof NextStepsResourceLadderNextPolicyEnum];

/**
 * 
 * @export
 * @interface NextStepsResourceLadderStepsInner
 */
export interface NextStepsResourceLadderStepsInner {
    /**
     * 
     * @type {NextStepsResourceLadderStepsInnerStageEnum}
     * @memberof NextStepsResourceLadderStepsInner
     */
    stage?: NextStepsResourceLadderStepsInnerStageEnum;
    /**
     * 
     * @type {NextStepsResourceLadderStepsInnerStateEnum}
     * @memberof NextStepsResourceLadderStepsInner
     */
    state?: NextStepsResourceLadderStepsInnerStateEnum;
    /**
     * 
     * @type {string}
     * @memberof NextStepsResourceLadderStepsInner
     */
    label?: string;
    /**
     * 
     * @type {string}
     * @memberof NextStepsResourceLadderStepsInner
     */
    description?: string;
    /**
     * edit: this step is a change to your DNS. done: that change is made. null: no DNS change.
     * @type {NextStepsResourceLadderStepsInnerDnsEnum}
     * @memberof NextStepsResourceLadderStepsInner
     */
    dns?: NextStepsResourceLadderStepsInnerDnsEnum | null;
}


/**
 * @export
 */
export const NextStepsResourceLadderStepsInnerStageEnum = {
    Monitor: 'monitor',
    Map: 'map',
    Align: 'align',
    Quarantine: 'quarantine',
    Reject: 'reject'
} as const;
export type NextStepsResourceLadderStepsInnerStageEnum = typeof NextStepsResourceLadderStepsInnerStageEnum[keyof typeof NextStepsResourceLadderStepsInnerStageEnum];

/**
 * @export
 */
export const NextStepsResourceLadderStepsInnerStateEnum = {
    Done: 'done',
    Current: 'current',
    Observing: 'observing',
    Next: 'next',
    Todo: 'todo'
} as const;
export type NextStepsResourceLadderStepsInnerStateEnum = typeof NextStepsResourceLadderStepsInnerStateEnum[keyof typeof NextStepsResourceLadderStepsInnerStateEnum];

/**
 * @export
 */
export const NextStepsResourceLadderStepsInnerDnsEnum = {
    Edit: 'edit',
    Done: 'done'
} as const;
export type NextStepsResourceLadderStepsInnerDnsEnum = typeof NextStepsResourceLadderStepsInnerDnsEnum[keyof typeof NextStepsResourceLadderStepsInnerDnsEnum];

/**
 * The policy the steps climb from: p=, or sp= when most of the domain's mail is sent from subdomains. value is null when the published policy cannot be read.
 * @export
 * @interface NextStepsResourcePolicy
 */
export interface NextStepsResourcePolicy {
    /**
     * 
     * @type {NextStepsResourcePolicyTagEnum}
     * @memberof NextStepsResourcePolicy
     */
    tag?: NextStepsResourcePolicyTagEnum;
    /**
     * 
     * @type {NextStepsResourcePolicyValueEnum}
     * @memberof NextStepsResourcePolicy
     */
    value?: NextStepsResourcePolicyValueEnum | null;
}


/**
 * @export
 */
export const NextStepsResourcePolicyTagEnum = {
    P: 'p',
    Sp: 'sp'
} as const;
export type NextStepsResourcePolicyTagEnum = typeof NextStepsResourcePolicyTagEnum[keyof typeof NextStepsResourcePolicyTagEnum];

/**
 * @export
 */
export const NextStepsResourcePolicyValueEnum = {
    None: 'none',
    Quarantine: 'quarantine',
    Reject: 'reject'
} as const;
export type NextStepsResourcePolicyValueEnum = typeof NextStepsResourcePolicyValueEnum[keyof typeof NextStepsResourcePolicyValueEnum];

/**
 * 
 * @export
 * @interface NextStepsResourceUnalignedSourcesInner
 */
export interface NextStepsResourceUnalignedSourcesInner {
    /**
     * The sending service, or the address when we cannot name it.
     * @type {string}
     * @memberof NextStepsResourceUnalignedSourcesInner
     */
    name?: string;
    /**
     * The service we recognised, or null.
     * @type {string}
     * @memberof NextStepsResourceUnalignedSourcesInner
     */
    provider?: string | null;
    /**
     * Sending addresses in this group.
     * @type {number}
     * @memberof NextStepsResourceUnalignedSourcesInner
     */
    addresses?: number;
    /**
     * 
     * @type {number}
     * @memberof NextStepsResourceUnalignedSourcesInner
     */
    messages?: number;
    /**
     * Of those, messages that passed DMARC.
     * @type {number}
     * @memberof NextStepsResourceUnalignedSourcesInner
     */
    aligned_messages?: number;
    /**
     * Why the mail does not pass DMARC.
     * @type {NextStepsResourceUnalignedSourcesInnerReasonEnum}
     * @memberof NextStepsResourceUnalignedSourcesInner
     */
    reason?: NextStepsResourceUnalignedSourcesInnerReasonEnum;
    /**
     * The reason, in the dashboard's words.
     * @type {string}
     * @memberof NextStepsResourceUnalignedSourcesInner
     */
    why?: string;
    /**
     * The repair, in the dashboard's words.
     * @type {string}
     * @memberof NextStepsResourceUnalignedSourcesInner
     */
    fix?: string;
    /**
     * The SPF include to add, only when the repair is the SPF record and the service has exactly one.
     * @type {string}
     * @memberof NextStepsResourceUnalignedSourcesInner
     */
    spf_include?: string | null;
    /**
     * The DNS records the service's DKIM setup asks for, when the repair is turning DKIM on there and we keep a guide for it. A value the service generates per account stays a <placeholder>.
     * @type {Array<NextStepsResourceUnalignedSourcesInnerDkimRecordsInner>}
     * @memberof NextStepsResourceUnalignedSourcesInner
     */
    dkim_records?: Array<NextStepsResourceUnalignedSourcesInnerDkimRecordsInner>;
}


/**
 * @export
 */
export const NextStepsResourceUnalignedSourcesInnerReasonEnum = {
    Relayed: 'relayed',
    DefaultKey: 'default_key',
    DkimForeign: 'dkim_foreign',
    SpfNotListed: 'spf_not_listed',
    SpfNone: 'spf_none',
    SpfForeign: 'spf_foreign',
    Unauthenticated: 'unauthenticated',
    Unexplained: 'unexplained'
} as const;
export type NextStepsResourceUnalignedSourcesInnerReasonEnum = typeof NextStepsResourceUnalignedSourcesInnerReasonEnum[keyof typeof NextStepsResourceUnalignedSourcesInnerReasonEnum];

/**
 * 
 * @export
 * @interface NextStepsResourceUnalignedSourcesInnerDkimRecordsInner
 */
export interface NextStepsResourceUnalignedSourcesInnerDkimRecordsInner {
    /**
     * 
     * @type {string}
     * @memberof NextStepsResourceUnalignedSourcesInnerDkimRecordsInner
     */
    type?: string;
    /**
     * 
     * @type {string}
     * @memberof NextStepsResourceUnalignedSourcesInnerDkimRecordsInner
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof NextStepsResourceUnalignedSourcesInnerDkimRecordsInner
     */
    value?: string;
}
/**
 * 
 * @export
 * @interface SetCheckWebhookRequest
 */
export interface SetCheckWebhookRequest {
    /**
     * The https endpoint to POST check.completed to. Must resolve to a public address.
     * @type {string}
     * @memberof SetCheckWebhookRequest
     */
    url?: string;
}
/**
 * 
 * @export
 * @interface TlsRptReportResource
 */
export interface TlsRptReportResource {
    /**
     * Our id for this report.
     * @type {number}
     * @memberof TlsRptReportResource
     */
    id: number;
    /**
     * The organisation that sent the report.
     * @type {string}
     * @memberof TlsRptReportResource
     */
    reporter: string;
    /**
     * The id the reporter gave the report.
     * @type {string}
     * @memberof TlsRptReportResource
     */
    report_id: string;
    /**
     * Start of the period the report covers.
     * @type {string}
     * @memberof TlsRptReportResource
     */
    date_begin: string;
    /**
     * End of the period the report covers.
     * @type {string}
     * @memberof TlsRptReportResource
     */
    date_end: string;
    /**
     * TLS sessions that succeeded.
     * @type {number}
     * @memberof TlsRptReportResource
     */
    success_count: number;
    /**
     * TLS sessions that failed.
     * @type {number}
     * @memberof TlsRptReportResource
     */
    failure_count: number;
    /**
     * The policies the reporter applied, each with its own counts.
     * @type {Array<TlsRptReportResourcePoliciesInner>}
     * @memberof TlsRptReportResource
     */
    policies: Array<TlsRptReportResourcePoliciesInner>;
}
/**
 * 
 * @export
 * @interface TlsRptReportResourcePoliciesInner
 */
export interface TlsRptReportResourcePoliciesInner {
    /**
     * 
     * @type {string}
     * @memberof TlsRptReportResourcePoliciesInner
     */
    type?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TlsRptReportResourcePoliciesInner
     */
    domain?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof TlsRptReportResourcePoliciesInner
     */
    mx_hosts?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof TlsRptReportResourcePoliciesInner
     */
    success_count?: number;
    /**
     * 
     * @type {number}
     * @memberof TlsRptReportResourcePoliciesInner
     */
    failure_count?: number;
    /**
     * The failure entries as the reporter sent them.
     * @type {Array<object>}
     * @memberof TlsRptReportResourcePoliciesInner
     */
    failure_details?: Array<object>;
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
    /**
     * Scan depth applied to every address in this batch. quick: syntax + DNS/MX only (0 credits each). standard: + SMTP RCPT probe, default (1 credit each). enhanced: + catch-all detection (3 credits each; known catch-all hosts billed at standard rate). Omitting mode is identical to standard.
     * @type {VerifyBatchRequestModeEnum}
     * @memberof VerifyBatchRequest
     */
    mode?: VerifyBatchRequestModeEnum | null;
}


/**
 * @export
 */
export const VerifyBatchRequestModeEnum = {
    Quick: 'quick',
    Standard: 'standard',
    Enhanced: 'enhanced'
} as const;
export type VerifyBatchRequestModeEnum = typeof VerifyBatchRequestModeEnum[keyof typeof VerifyBatchRequestModeEnum];

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
     * Signals that drove the recommendation. Values correspond to VerifyReason identifiers, plus quota_exhausted on an Email-Guard degrade response (see the degraded flag).
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
     * 0-10 domain reputation score, higher is better. Null when the domain has not been scored yet.
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
     * True when a DKIM key was found at one of the common selector names we probe. False means none was found at those names. Because DKIM selectors cannot be enumerated from DNS (the signer picks the name), false is not proof that the domain has no DKIM: a domain signing with a custom selector reads as false. Null when DKIM has not been checked yet.
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
    /**
     * The domain is on our curated blocklist of malicious or impersonation domains (EM-1258). A hard signal: treat any address on it as unsafe and reject it.
     * @type {boolean}
     * @memberof VerifyDomainResponse
     */
    blocked?: boolean;
    /**
     * A short public-facing label explaining why the domain is blocked (e.g. "confirmed phishing"), when the admin set one. Null unless blocked and a label was recorded. Never carries internal notes.
     * @type {string}
     * @memberof VerifyDomainResponse
     */
    blocked_label?: string | null;
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
    Isp: 'isp',
    Relay: 'relay'
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
     * Why the pipeline decided. greylisted, smtp_timeout, smtp_unreachable, smtp_throttled, probe_suppressed, probe_budget_exhausted and verification_pending all leave the address unproven. smtp_throttled means our own per-MX rate limit refused the connection, so nothing was asked of the mail server and a retry a few minutes later usually gets an answer. probe_suppressed means we have undertaken not to open a connection to that target at all, so a retry returns the same thing until that changes; nothing was asked of the mail server, so the lookup is refunded. The one exception is a target on our curated trap registry (spam_trap_type = known_trap_domain), which is billed. Read spam_trap_type for that, not the decision object: a target our heuristic flagged (reputation_heuristic) comes back review + spam_trap just the same and is refunded. probe_budget_exhausted belongs to the anonymous web tool, which runs on a shared daily probe budget; an API key is never subject to it, so you will not see it here. Null on results cached before reasons existed.
     * @type {VerifyResultResponseReasonEnum}
     * @memberof VerifyResultResponse
     */
    reason?: VerifyResultResponseReasonEnum | null;
    /**
     * DNS found a mail route for the domain. This is a pure DNS answer, not a connection test: reachability of the host is never probed here. True also covers the RFC 5321 fallback where the domain publishes no MX at all and its A or AAAA record acts as the implicit mail exchanger, so true is not proof that MX records exist. On a cached_recent result stored before this flag was recorded per address, true may be inferred from the presence of a stored mail host rather than observed, so read it together with reason when reason is no_mx. False means no MX, A or AAAA record, or that the check stopped before the DNS lookup (bad syntax, or a degraded response), so false is not proof that the domain cannot receive mail.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    mx: boolean;
    /**
     * The primary mail exchanger resolved during this check. On the A/AAAA fallback described under mx, this is the bare domain rather than a published MX host. Null when freshness is cached_recent, because the host list is not stored alongside the cached verdict, and null when nothing was resolved. A null here therefore does not contradict mx being true, and is not evidence that the domain has no mail route.
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
     * The address sits on a relay / forwarding / alias-masking service (SimpleLogin, Apple Hide My Email, Cloudflare Email Routing, ...). The address is deliverable and reaches a real person, it is just masked, so this never changes the verdict or decision. Use it to apply your own policy on masked senders.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    relay: boolean;
    /**
     * Name of the relay provider when relay is true, null otherwise.
     * @type {string}
     * @memberof VerifyResultResponse
     */
    relay_provider?: string | null;
    /**
     * The address is on a parked or for-sale domain. Informational only: it never changes the verdict, but a parked domain rarely runs a real mailbox.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    parked: boolean;
    /**
     * The mail host is a known or suspected spam trap. Informational only: it never changes the verdict, and it is never a hard block. But sending to a trap hurts your sender reputation, so the recommendation drops to review. See spam_trap_type for how it was identified.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    spam_trap: boolean;
    /**
     * How the trap was identified: known_trap_domain (the mail host is on our curated trap registry) or reputation_heuristic (it matched a conservative parked + spam-list heuristic). Null when spam_trap is false.
     * @type {VerifyResultResponseSpamTrapTypeEnum}
     * @memberof VerifyResultResponse
     */
    spam_trap_type?: VerifyResultResponseSpamTrapTypeEnum | null;
    /**
     * A corrected address when the domain looks like a typo of a high-volume domain (gmial.com -> jane@gmail.com). Null when nothing looks mistyped. Advisory only: it never changes the verdict, so show it as a "did you mean" hint and let the sender decide.
     * @type {string}
     * @memberof VerifyResultResponse
     */
    suggested_correction?: string | null;
    /**
     * Enhanced scan only: the granular mailbox state read from the SMTP reply (mailbox_full, mailbox_disabled, mailbox_not_found, greylist_deferred, policy_block, accepted). Null on Quick / Standard scans, which do not run the deep probe. Explains the verdict, never overrides it.
     * @type {VerifyResultResponseSmtpDiagnosisEnum}
     * @memberof VerifyResultResponse
     */
    smtp_diagnosis?: VerifyResultResponseSmtpDiagnosisEnum | null;
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
     * Domain-level intelligence. Null when we hold no crawl data for the domain: either it has not been crawled yet, or it is itself a public suffix (co.uk, github.io, a dynamic-DNS root such as kozow.com), which we do not crawl as one domain because unrelated owners share it.
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
    /**
     * Email-Guard only: true when your monthly remote-decision quota is used up and the Verify API declined to run a remote check. The SDK falls back to its local checks (syntax + the bundled disposable list) until the quota resets at the start of next month. false on every normal response. See docs/decisions/email-guard.md.
     * @type {boolean}
     * @memberof VerifyResultResponse
     */
    degraded?: boolean;
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
    AcceptAllProvider: 'accept_all_provider',
    Greylisted: 'greylisted',
    SmtpTimeout: 'smtp_timeout',
    SmtpUnreachable: 'smtp_unreachable',
    SmtpThrottled: 'smtp_throttled',
    ProbeSuppressed: 'probe_suppressed',
    ProbeBudgetExhausted: 'probe_budget_exhausted',
    VerificationPending: 'verification_pending',
    BlockedDomain: 'blocked_domain',
    SpamTrap: 'spam_trap'
} as const;
export type VerifyResultResponseReasonEnum = typeof VerifyResultResponseReasonEnum[keyof typeof VerifyResultResponseReasonEnum];

/**
 * @export
 */
export const VerifyResultResponseSpamTrapTypeEnum = {
    KnownTrapDomain: 'known_trap_domain',
    ReputationHeuristic: 'reputation_heuristic'
} as const;
export type VerifyResultResponseSpamTrapTypeEnum = typeof VerifyResultResponseSpamTrapTypeEnum[keyof typeof VerifyResultResponseSpamTrapTypeEnum];

/**
 * @export
 */
export const VerifyResultResponseSmtpDiagnosisEnum = {
    Accepted: 'accepted',
    MailboxFull: 'mailbox_full',
    MailboxDisabled: 'mailbox_disabled',
    MailboxNotFound: 'mailbox_not_found',
    GreylistDeferred: 'greylist_deferred',
    PolicyBlock: 'policy_block'
} as const;
export type VerifyResultResponseSmtpDiagnosisEnum = typeof VerifyResultResponseSmtpDiagnosisEnum[keyof typeof VerifyResultResponseSmtpDiagnosisEnum];

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
    /**
     * Scan depth. quick: syntax + DNS/MX only, no SMTP probe (0 credits). standard: + SMTP RCPT probe, default (1 credit). enhanced: + catch-all detection via random RCPT probe (3 credits; known catch-all hosts are billed at the standard rate). Omitting mode is identical to standard.
     * @type {VerifySingleRequestModeEnum}
     * @memberof VerifySingleRequest
     */
    mode?: VerifySingleRequestModeEnum | null;
    /**
     * Return immediately without waiting for the live SMTP probe. The address is checked at DNS/MX depth; when a mailbox probe is still needed the response carries reason "verification_pending" while the SMTP check runs in the background. To read the verdict, call this endpoint again for the same address after roughly 1 to 3 seconds: the follow-up is a cache hit with the resolved result. Keep polling until reason is no longer "verification_pending". Each call is billed (standard verify is free on a paid plan, so polling costs nothing there). Billing is otherwise unchanged: async only changes when the result is delivered, not what you pay, so enhanced mode still runs its catch-all probe in the background and is billed at the enhanced rate. For large async batches, prefer POST /v1/verify/jobs, which returns a job id you poll with GET /v1/verify/jobs/{id} and whose status polls are free. Ignored for quick mode (already DNS-only). Default false.
     * @type {boolean}
     * @memberof VerifySingleRequest
     */
    async?: boolean | null;
}


/**
 * @export
 */
export const VerifySingleRequestModeEnum = {
    Quick: 'quick',
    Standard: 'standard',
    Enhanced: 'enhanced'
} as const;
export type VerifySingleRequestModeEnum = typeof VerifySingleRequestModeEnum[keyof typeof VerifySingleRequestModeEnum];

