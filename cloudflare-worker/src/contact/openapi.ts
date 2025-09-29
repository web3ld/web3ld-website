import { 
  OpenAPIRegistry, 
  OpenApiGeneratorV31,
  RouteConfig 
} from '@asteasolutions/zod-to-openapi';
import { 
  ContactRequestSchema, 
  SuccessResponseSchema, 
  ErrorResponseSchema 
} from './schemas';

export function generateOpenApiSpec() {
  const registry = new OpenAPIRegistry();

  // Register the contact endpoint
  const contactRoute: RouteConfig = {
    method: 'post',
    path: '/contact',
    summary: 'Submit contact form',
    description: 'Submit a contact form with Turnstile verification and rate limiting',
    tags: ['Contact'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ContactRequestSchema,
          },
        },
        required: true,
        description: 'Contact form submission data',
      },
    },
    responses: {
      200: {
        description: 'Message sent successfully',
        content: {
          'application/json': {
            schema: SuccessResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request - validation or verification failed',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
      429: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
            example: {
              error: 'Too many requests. Please try again after 24 hours.',
              remaining: 0,
            },
          },
        },
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  };

  registry.registerPath(contactRoute);

  // CORS OPTIONS endpoint
  const corsRoute: RouteConfig = {
    method: 'options',
    path: '/contact',
    summary: 'CORS preflight',
    description: 'Handle CORS preflight requests',
    tags: ['Contact'],
    responses: {
      204: {
        description: 'No content',
        headers: {
          'Access-Control-Allow-Origin': {
            schema: { type: 'string' },
            description: 'Allowed origin',
          },
          'Access-Control-Allow-Methods': {
            schema: { type: 'string' },
            description: 'Allowed methods',
          },
          'Access-Control-Allow-Headers': {
            schema: { type: 'string' },
            description: 'Allowed headers',
          },
        },
      },
    },
  };

  registry.registerPath(corsRoute);

  // Generate the OpenAPI document
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Web3LD Contact API',
      version: '1.0.0',
      description: 'Contact form submission API with rate limiting and email verification',
      contact: {
        name: 'Web3LD Support',
        email: 'support@web3ld.org',
        url: 'https://web3ld.org',
      },
    },
    servers: [
      {
        url: 'https://contact-form-worker.web3ld.workers.dev',
        description: 'Production server',
      },
      {
        url: 'http://localhost:8787',
        description: 'Local development server',
      },
    ],
    tags: [
      {
        name: 'Contact',
        description: 'Contact form operations',
      },
    ],
  });
}