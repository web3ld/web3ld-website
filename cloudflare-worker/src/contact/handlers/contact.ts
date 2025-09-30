import { Env, RateLimitResult } from '../types';
import { ContactRequestSchema } from '../schemas';
import { verifyTurnstile } from '../services/turnstile';
import { sendEmailViaBrevo } from '../services/email';
import { 
  getCorsHeaders, 
  handleOptions, 
  createErrorResponse, 
  createSuccessResponse 
} from '../middleware/cors';

export async function handleContactRequest(request: Request, env: Env): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);

  try {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(corsHeaders);
    }

    if (request.method !== 'POST') {
      return createErrorResponse('Method not allowed', 405, corsHeaders);
    }

    // Validate environment
    const validationResult = validateEnvironment(env);
    if (validationResult) {
      return validationResult;
    }

    // Parse and validate request body
    const rawData = await request.json();
    const validationResponse = ContactRequestSchema.safeParse(rawData);
    
    if (!validationResponse.success) {
      return createErrorResponse(
        'Validation failed',
        400,
        corsHeaders,
        validationResponse.error.issues
      );
    }

    const data = validationResponse.data;
    console.log('Form submission from:', data.email, 'Name:', data.name);
    
    // Get client IP
    const clientIp = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For')?.split(',')[0] || 
                    'unknown';

    // Development mode check
    if (isDevMode(env)) {
      console.log('Dev mode - skipping verification and email send');
      return createSuccessResponse({
        success: true,
        message: 'Dev mode - Form received successfully'
      }, corsHeaders);
    }

    // Check if using backdoor - bypasses all verification and rate limiting
    const isBackdoor = env.BACKDOOR_CONTACT_KEY && data.turnstileToken === env.BACKDOOR_CONTACT_KEY;
    
    let rateLimitResult = { allowed: true, remaining: 999 }; // Default for backdoor
    
    if (!isBackdoor) {
      // Regular flow: Verify Turnstile
      console.log('Verifying Turnstile token...');
      const turnstileVerified = await verifyTurnstile(
        data.turnstileToken,
        env.TURNSTILE_SECRET_KEY,
        clientIp
      );

      if (!turnstileVerified) {
        console.error('Turnstile verification failed');
        return createErrorResponse('Verification failed', 400, corsHeaders);
      }
      console.log('Turnstile verified successfully');

      // Check rate limit only for non-backdoor requests
      console.log('Checking rate limit for IP:', clientIp);
      rateLimitResult = await checkRateLimit(env, clientIp);
      
      if (!rateLimitResult.allowed) {
        console.warn('Rate limit exceeded for IP:', clientIp);
        return createErrorResponse(
          'Too many requests. Please try again after 24 hours.',
          429,
          corsHeaders,
          { remaining: rateLimitResult.remaining }
        );
      }
    } else {
      console.log('Backdoor key detected - bypassing verification and rate limit');
    }

    // Send email
    console.log('Sending email via Brevo...');
    const emailResult = await sendEmailViaBrevo(data, env);

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      return createErrorResponse(
        emailResult.error || 'Failed to send email',
        500,
        corsHeaders,
        emailResult.details
      );
    }

    console.log('Email sent successfully! MessageId:', emailResult.messageId);
    return createSuccessResponse({
      success: true,
      message: 'Message sent successfully',
      messageId: emailResult.messageId,
      remaining: rateLimitResult.remaining
    }, corsHeaders);

  } catch (error) {
    console.error('Worker error:', error);
    return createErrorResponse(
      'Internal server error',
      500,
      corsHeaders,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

function validateEnvironment(env: Env): Response | null {
  console.log('Environment check:', {
    hasBrevoKey: !!env.BREVO_API_KEY,
    brevoKeyLength: env.BREVO_API_KEY?.length,
    hasTurnstileKey: !!env.TURNSTILE_SECRET_KEY,
    senderEmail: env.SENDER_EMAIL,
    receiverEmail: env.RECEIVER_EMAIL,
    hasBackdoorKey: !!env.BACKDOOR_CONTACT_KEY
  });

  if (!env.BREVO_API_KEY || !env.TURNSTILE_SECRET_KEY || !env.SENDER_EMAIL || !env.RECEIVER_EMAIL) {
    console.error('Missing environment variables:', {
      BREVO_API_KEY: !!env.BREVO_API_KEY,
      TURNSTILE_SECRET_KEY: !!env.TURNSTILE_SECRET_KEY,
      SENDER_EMAIL: !!env.SENDER_EMAIL,
      RECEIVER_EMAIL: !!env.RECEIVER_EMAIL
    });
    
    if (isDevMode(env)) {
      console.log('Running in dev mode - skipping verification');
      return createSuccessResponse({
        success: true,
        message: 'Dev mode - Form received successfully'
      }, getCorsHeaders(new Request('http://localhost')));
    }
    
    return createErrorResponse(
      'Server configuration error',
      500,
      getCorsHeaders(new Request('http://localhost'))
    );
  }

  return null;
}

function isDevMode(env: Env): boolean {
  return !env.BREVO_API_KEY || env.BREVO_API_KEY === 'dev';
}

async function checkRateLimit(env: Env, clientIp: string): Promise<RateLimitResult> {
  const rateLimiterId = env.RATE_LIMITER.idFromName(clientIp);
  const rateLimiter = env.RATE_LIMITER.get(rateLimiterId);
  
  const response = await rateLimiter.fetch(
    new Request('https://rate-limiter/check', { method: 'POST' })
  );

  const result = await response.json() as RateLimitResult;
  console.log('Rate limit check:', result);
  
  return result;
}