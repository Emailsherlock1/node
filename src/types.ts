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
  /** 0–1 confidence, higher is safer to send to. */
  score: number;
  /** fresh · cached_recent · cached_stale_refreshed */
  freshness: Freshness;
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
