import type {
  VerifyResultResponse,
  BatchItemError,
  VerifyBatchResponseResultsInner,
  ImpersonationAnalyzeRequest,
  ImpersonationAnalyzeRequestProtectedInner,
  ListChecksRequest,
  GetDmarcSummaryRequest,
  ListDmarcReportsRequest,
  ListDmarcSourcesRequest,
  ListTlsRptReportsRequest,
  ListDomainChangesRequest,
} from './generated/index.js';

/** Paging for `client.deliverability.listChecks(id, options)`. */
export type ListChecksOptions = Omit<ListChecksRequest, 'id'>;

/** Range for `client.dmarc.summary(domain, options)`: 7 or 30 days. */
export type DmarcSummaryOptions = Omit<GetDmarcSummaryRequest, 'domain'>;

/** Filters and paging for `client.dmarc.reports(domain, options)`. `from` and `to` are dates (YYYY-MM-DD). */
export type DmarcReportsOptions = Omit<ListDmarcReportsRequest, 'domain'>;

/** Range, filters and paging for `client.dmarc.sources(domain, options)`. */
export type DmarcSourcesOptions = Omit<ListDmarcSourcesRequest, 'domain'>;

/** Range and paging for `client.tlsRpt.reports(domain, options)`. */
export type TlsRptReportsOptions = Omit<ListTlsRptReportsRequest, 'domain'>;

/** Paging for `client.domains.changes(domain, options)`. */
export type DomainChangesOptions = Omit<ListDomainChangesRequest, 'domain'>;

/**
 * Body of `client.impersonation.analyze(request)`, with the wire field names.
 * The generated `ImpersonationAnalyzeRequest` names the identity list
 * `_protected` (a reserved word in the generator), but the API reads
 * `protected`, so this type carries `protected` instead.
 */
export type ImpersonationAnalyzeParams = Omit<ImpersonationAnalyzeRequest, '_protected'> & {
  protected: ImpersonationAnalyzeRequestProtectedInner[];
};

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
