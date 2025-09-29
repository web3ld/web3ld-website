// Environment configuration
export interface Env {
  // Durable Objects
  RATE_LIMITER: DurableObjectNamespace;
  
  // Required secrets
  BREVO_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  SENDER_EMAIL: string;
  RECEIVER_EMAIL: string;
  
  // Optional secrets
  BACKDOOR_CONTACT_KEY?: string;
}

// Brevo API types
export interface BrevoEmailContent {
  sender: {
    email: string;
    name: string;
  };
  to: Array<{
    email: string;
    name: string;
  }>;
  subject: string;
  htmlContent: string;
  textContent: string;
  replyTo: {
    email: string;
    name: string;
  };
}

export interface BrevoResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: any;
}

// Turnstile verification types
export interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

// Rate limiter types
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

// Re-export schema types for convenience
export { 
  ContactRequestData,
  SuccessResponse,
  ErrorResponse 
} from './schemas';