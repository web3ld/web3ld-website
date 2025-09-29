import { Env } from './types';
import { handleContactRequest } from './handlers/contact';

// Export Durable Object
export { RateLimiter } from './durableObjects/rateLimiter';

// Main worker entry point
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleContactRequest(request, env);
  },
};