export { Emailsherlock, VerifyResource, GuardResource } from './client.js';
export type { ClientOptions } from './client.js';
export { VERSION } from './version.js';
export {
  EmailsherlockError,
  AuthenticationError,
  ForbiddenError,
  InsufficientCreditsError,
  RateLimitError,
  ValidationError,
  ServiceUnavailableError,
} from './errors.js';
export { isVerifyResult } from './types.js';
export type { RateLimit } from './types.js';

// Response + request model types, regenerated from the OpenAPI spec.
export type {
  VerifyResultResponse,
  VerifyBatchResponse,
  VerifyBatchResponseResultsInner,
  VerifyJobResponse,
  VerifyJobResponseProgress,
  VerifyDomainResponse,
  VerifyDecisionResponse,
  BatchItemError,
  AccountStatusResponse,
  AccountStatusResponseCredits,
  AccountStatusResponseRateLimit,
  GuardEventsRequest,
} from './generated/index.js';

import { Emailsherlock } from './client.js';
export default Emailsherlock;
