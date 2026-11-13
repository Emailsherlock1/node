import type {
  VerifyResultResponse,
  BatchItemError,
  VerifyBatchResponseResultsInner,
} from './generated/index.js';

/** Rate-limit window read from the X-RateLimit-* response headers. */
export interface RateLimit {
  limit: number | null;
  remaining: number | null;
  reset: number | null;
}

/**
 * Type guard for a batch entry: did this address verify, or fail? A failed
 * entry is a `BatchItemError` ({ email, error }); a verified one is a full
 * `VerifyResultResponse`.
 */
export function isVerifyResult(
  item: VerifyBatchResponseResultsInner,
): item is VerifyResultResponse {
  return (item as BatchItemError).error === undefined;
}
