/** The verdict for a single address. Mirrors the API `result` enum. */
export type VerifyVerdict =
  | 'valid'
  | 'invalid'
  | 'catch_all'
  | 'disposable'
  | 'role'
  | 'unknown';

/** How recent the underlying data is. Mirrors the API `freshness` enum. */
export type Freshness = 'fresh' | 'cached_recent' | 'cached_stale_refreshed';

/** Why the verdict came out the way it did. Mirrors the API `reason` enum. */
export type VerifyReason =
  | 'bad_syntax'
  | 'no_mx'
  | 'mailbox_accepts'
  | 'mailbox_not_found'
  | 'disposable_provider'
  | 'role_address'
  | 'catch_all_domain'
  | 'greylisted'
  | 'smtp_timeout'
  | 'smtp_unreachable'
  | 'verification_pending';

/** Domain-level intelligence for the verified address. Mirrors the wire JSON. */
export interface VerifyDomain {
  /** The domain part of the address. */
  name: string;
  /** Host types such as freemail, disposable, custom, company, government, education, public, isp. */
  types: string[] | null;
  /** Domain trust score, 0-100, higher is better. */
  score: number | null;
  /** The domain publishes an SPF record. */
  spf: boolean | null;
  /** The domain publishes at least one DKIM key. */
  dkim: boolean | null;
  /** The domain publishes a DMARC record. */
  dmarc: boolean | null;
  /** none · quarantine · reject */
  dmarc_policy: 'none' | 'quarantine' | 'reject' | null;
  /** The domain publishes an MTA-STS policy. */
  mta_sts: boolean | null;
  /** The domain publishes a TLS-RPT record. */
  tls_rpt: boolean | null;
  /** The domain publishes a BIMI record. */
  bimi: boolean | null;
  /** The MX hosts publish DANE/TLSA records. */
  dane: boolean | null;
  /** Number of DNS blacklists currently listing the domain's mail IPs. */
  blacklists: number | null;
  /** secure · insecure · bogus */
  dnssec: 'secure' | 'insecure' | 'bogus' | null;
  /** The domain publishes a CAA record. */
  caa: boolean | null;
}

/** The result object returned for a verified address. Mirrors the wire JSON. */
export interface VerifyResult {
  /** The address that was checked. */
  email: string;
  /** valid · invalid · catch_all · disposable · role · unknown */
  result: VerifyVerdict;
  /** The domain has reachable MX records. */
  mx: boolean;
  /** Throwaway / temporary-mail provider. */
  disposable: boolean;
  /** Role address such as info@ or sales@. */
  role: boolean;
  /** Host accepts mail for any local part. */
  catch_all: boolean;
  /** 0–1 confidence, higher is safer to send to. Null when the verdict is unknown. */
  score: number | null;
  /** fresh · cached_recent · cached_stale_refreshed */
  freshness: Freshness;
  /**
   * SMTP-proven deliverability: true only after an SMTP accept, false only on
   * a provable failure, null when unproven. Missing on older API versions.
   */
  deliverable?: boolean | null;
  /** Why the verdict came out the way it did. Missing on older API versions. */
  reason?: VerifyReason | null;
  /** The primary MX host for the domain. Missing on older API versions. */
  mx_record?: string | null;
  /** The address belongs to a free webmail provider. Missing on older API versions. */
  free_email?: boolean | null;
  /** When the check ran, ISO 8601. Missing on older API versions. */
  checked_at?: string | null;
  /** Domain-level intelligence. Missing on older API versions. */
  domain?: VerifyDomain | null;
}

/** A per-address failure inside a batch response. */
export interface BatchItemError {
  email: string | null;
  error: 'invalid_email' | 'insufficient_credits' | 'verify_unavailable';
}

export type BatchItem = VerifyResult | BatchItemError;

export interface BatchResponse {
  results: BatchItem[];
}

/** Type guard: did this batch item verify, or fail? */
export function isVerifyResult(item: BatchItem): item is VerifyResult {
  return (item as BatchItemError).error === undefined;
}

export interface RateLimit {
  limit: number | null;
  remaining: number | null;
  reset: number | null;
}
