export interface Env {
  RATE_LIMITER: DurableObjectNamespace;
  BREVO_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  SENDER_EMAIL: string;
  RECEIVER_EMAIL: string;
}

interface ContactFormData {
  name: string;
  email: string;
  organization?: string;
  title?: string;
  message: string;
  turnstileToken: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Get origin for CORS
    const origin = request.headers.get('Origin') || '';
    
    // Allowed origins
    const allowedOrigins = [
      'https://web3ld.org',
      'https://www.web3ld.org',
      'http://localhost:3000',
      'http://localhost:3001',
      /https:\/\/.*\.vercel\.app$/, // Vercel preview URLs
    ];
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    // CORS headers - ALWAYS include these, even on errors
    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowed ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
    };

    try {
      // Handle preflight - THIS MUST BE FIRST
      if (request.method === 'OPTIONS') {
        return new Response(null, { 
          status: 204, // Use 204 No Content for OPTIONS
          headers: corsHeaders 
        });
      }

      if (request.method !== 'POST') {
        return new Response('Method not allowed', { 
          status: 405,
          headers: corsHeaders 
        });
      }

      // Log environment status
      console.log('Environment check:', {
        hasBrevoKey: !!env.BREVO_API_KEY,
        brevoKeyLength: env.BREVO_API_KEY?.length,
        hasTurnstileKey: !!env.TURNSTILE_SECRET_KEY,
        senderEmail: env.SENDER_EMAIL,
        receiverEmail: env.RECEIVER_EMAIL
      });

      // Check if environment variables are set
      if (!env.BREVO_API_KEY || !env.TURNSTILE_SECRET_KEY || !env.SENDER_EMAIL || !env.RECEIVER_EMAIL) {
        console.error('Missing environment variables:', {
          BREVO_API_KEY: !!env.BREVO_API_KEY,
          TURNSTILE_SECRET_KEY: !!env.TURNSTILE_SECRET_KEY,
          SENDER_EMAIL: !!env.SENDER_EMAIL,
          RECEIVER_EMAIL: !!env.RECEIVER_EMAIL
        });
        
        // Development mode fallback
        const isDev = !env.BREVO_API_KEY || env.BREVO_API_KEY === 'dev';
        
        if (isDev) {
          console.log('Running in dev mode - skipping verification');
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Dev mode - Form received successfully' 
            }),
            { 
              status: 200,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            }
          );
        }
        
        return new Response(
          JSON.stringify({ error: 'Server configuration error' }),
          { 
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      const data: ContactFormData = await request.json();
      console.log('Form submission from:', data.email, 'Name:', data.name);
      
      // Get client IP
      const clientIp = request.headers.get('CF-Connecting-IP') || 
                      request.headers.get('X-Forwarded-For')?.split(',')[0] || 
                      'unknown';

      // Development mode - skip real processing
      const isDev = env.BREVO_API_KEY === 'dev' || !env.BREVO_API_KEY;
      
      if (isDev) {
        console.log('Dev mode - skipping verification and email send');
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Dev mode - Form received successfully' 
          }),
          { 
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Production mode
      
      // 1. Verify Turnstile token
      console.log('Verifying Turnstile token...');
      const turnstileVerified = await verifyTurnstile(
        data.turnstileToken,
        env.TURNSTILE_SECRET_KEY,
        clientIp
      );

      if (!turnstileVerified) {
        console.error('Turnstile verification failed');
        return new Response(
          JSON.stringify({ error: 'Verification failed' }),
          { 
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      console.log('Turnstile verified successfully');

      // 2. Check rate limit using Durable Object
      console.log('Checking rate limit for IP:', clientIp);
      const rateLimiterId = env.RATE_LIMITER.idFromName(clientIp);
      const rateLimiter = env.RATE_LIMITER.get(rateLimiterId);
      
      const rateLimitResponse = await rateLimiter.fetch(
        new Request('https://rate-limiter/check', {
          method: 'POST'
        })
      );

      const rateLimitResult = await rateLimitResponse.json() as { allowed: boolean; remaining: number };
      console.log('Rate limit check:', rateLimitResult);

      if (!rateLimitResult.allowed) {
        console.warn('Rate limit exceeded for IP:', clientIp);
        return new Response(
          JSON.stringify({ 
            error: 'Too many requests. Please try again after 24 hours.',
            remaining: rateLimitResult.remaining 
          }),
          { 
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // 3. Send email via Brevo
      console.log('Sending email via Brevo...');
      const emailResult = await sendEmailViaBrevo(data, env);

      if (!emailResult.success) {
        console.error('Failed to send email:', emailResult.error);
        return new Response(
          JSON.stringify({ 
            error: emailResult.error || 'Failed to send email',
            details: emailResult.details 
          }),
          { 
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      console.log('Email sent successfully! MessageId:', emailResult.messageId);
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Message sent successfully',
          messageId: emailResult.messageId,
          remaining: rateLimitResult.remaining 
        }),
        { 
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );

    } catch (error) {
      console.error('Worker error:', error);
      
      // ALWAYS return CORS headers even on error
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  },
};

async function verifyTurnstile(
  token: string,
  secretKey: string,
  remoteIp: string
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    formData.append('remoteip', remoteIp);

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json() as { success: boolean; 'error-codes'?: string[] };
    
    if (!result.success) {
      console.error('Turnstile verification failed:', result['error-codes']);
    }
    
    return result.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

interface BrevoResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: any;
}

async function sendEmailViaBrevo(
  data: ContactFormData,
  env: Env
): Promise<BrevoResult> {
  // Log email configuration
  console.log('Brevo email config:', {
    from: env.SENDER_EMAIL,
    to: env.RECEIVER_EMAIL,
    replyTo: data.email,
    subject: `New Contact Form Submission from ${data.name}`
  });

  const emailContent = {
    sender: {
      email: env.SENDER_EMAIL,
      name: 'Contact Form'
    },
    to: [
      {
        email: env.RECEIVER_EMAIL,
        name: 'Admin'
      }
    ],
    subject: `New Contact Form Submission from ${data.name}`,
    htmlContent: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.organization ? `<p><strong>Organization:</strong> ${data.organization}</p>` : ''}
      ${data.title ? `<p><strong>Title:</strong> ${data.title}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Sent via Contact Form</p>
    `,
    textContent: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.organization ? `Organization: ${data.organization}\n` : ''}
${data.title ? `Title: ${data.title}\n` : ''}

Message:
${data.message}
    `.trim(),
    replyTo: {
      email: data.email,
      name: data.name
    }
  };

  try {
    console.log('Calling Brevo API...');
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY
      },
      body: JSON.stringify(emailContent)
    });

    const responseText = await response.text();
    console.log('Brevo raw response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Brevo response as JSON');
      return {
        success: false,
        error: 'Invalid response from email service',
        details: responseText
      };
    }

    if (response.ok && responseData.messageId) {
      console.log('✅ Brevo email sent successfully! MessageId:', responseData.messageId);
      return {
        success: true,
        messageId: responseData.messageId
      };
    } else {
      console.error('❌ Brevo API error:', responseData);
      return {
        success: false,
        error: responseData.message || 'Failed to send email',
        details: responseData
      };
    }
  } catch (error) {
    console.error('Brevo API exception:', error);
    return {
      success: false,
      error: 'Email service error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Durable Object for Rate Limiting
export class RateLimiter {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);
    
    // Get stored attempts
    const attempts = await this.state.storage.get<number[]>('attempts') || [];
    
    // Filter out attempts older than 24 hours
    const recentAttempts = attempts.filter(timestamp => timestamp > dayAgo);
    
    // Check if under limit (2 per 24 hours)
    const allowed = recentAttempts.length < 2;
    
    if (allowed) {
      // Add new attempt
      recentAttempts.push(now);
      await this.state.storage.put('attempts', recentAttempts);
      
      // Set alarm to clean up old data after 24 hours
      await this.state.storage.setAlarm(now + (24 * 60 * 60 * 1000));
    }
    
    return new Response(
      JSON.stringify({ 
        allowed,
        remaining: Math.max(0, 2 - recentAttempts.length)
      }),
      { 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  async alarm(): Promise<void> {
    // Clean up old attempts when alarm triggers
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);
    
    const attempts = await this.state.storage.get<number[]>('attempts') || [];
    const recentAttempts = attempts.filter(timestamp => timestamp > dayAgo);
    
    if (recentAttempts.length > 0) {
      await this.state.storage.put('attempts', recentAttempts);
      // Set next cleanup alarm
      await this.state.storage.setAlarm(now + (24 * 60 * 60 * 1000));
    } else {
      // No recent attempts, clear storage
      await this.state.storage.delete('attempts');
    }
  }
}