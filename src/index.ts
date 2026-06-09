export { Emailsherlock, VerifyResource } from './client.js';
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
export {
  isVerifyResult,
} from './types.js';
export type {
  VerifyResult,
  VerifyVerdict,
  VerifyReason,
  VerifyDomain,
  Freshness,
  BatchItem,
  BatchItemError,
  BatchResponse,
  RateLimit,
} from './types.js';

import { Emailsherlock } from './client.js';
export default Emailsherlock;
