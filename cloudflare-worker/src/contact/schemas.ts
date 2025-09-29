import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

// Base schema without OpenAPI metadata for frontend use
export const ContactFormBaseSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .max(50, 'Email must be 50 characters or less')
    .email('Please enter a valid email address'),
  
  organization: z
    .string()
    .max(100, 'Organization/Project must be 100 characters or less')
    .optional()
    .or(z.literal('')),
  
  title: z
    .string()
    .max(100, 'Title/Role must be 100 characters or less')
    .optional()
    .or(z.literal('')),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(3000, 'Message must be 3000 characters or less'),
  
  turnstileToken: z
    .string()
    .min(1, 'Verification required'),
});

// Worker version with OpenAPI metadata
export const ContactRequestSchema = ContactFormBaseSchema.extend({
  name: ContactFormBaseSchema.shape.name.openapi({ 
    description: 'Name or alias of the sender',
    example: 'John Doe' 
  }),
  email: ContactFormBaseSchema.shape.email.openapi({ 
    description: 'Contact email address',
    example: 'john@example.com' 
  }),
  organization: ContactFormBaseSchema.shape.organization.openapi({ 
    description: 'Organization or project name',
    example: 'Acme Corp' 
  }),
  title: ContactFormBaseSchema.shape.title.openapi({ 
    description: 'Title or role',
    example: 'CTO' 
  }),
  message: ContactFormBaseSchema.shape.message.openapi({ 
    description: 'Message content',
    example: 'I would like to discuss...' 
  }),
  turnstileToken: ContactFormBaseSchema.shape.turnstileToken.openapi({ 
    description: 'Cloudflare Turnstile verification token',
    example: 'token_xyz123' 
  }),
}).openapi('ContactRequest');

// Response schemas (unchanged)
export const SuccessResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: 'Message sent successfully' }),
  messageId: z.string().optional().openapi({ example: 'msg_123' }),
  remaining: z.number().optional().openapi({ example: 2, description: 'Remaining submissions in 24h window' }),
}).openapi('SuccessResponse');

export const ErrorResponseSchema = z.object({
  error: z.string().openapi({ example: 'Verification failed' }),
  details: z.any().optional().openapi({ description: 'Additional error details' }),
  remaining: z.number().optional().openapi({ example: 0 }),
}).openapi('ErrorResponse');

// Type exports
export type ContactFormData = z.infer<typeof ContactFormBaseSchema>;
export type ContactRequestData = z.infer<typeof ContactRequestSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;