// components/utilities/forms/contact/contactSchema.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less'),

  email: z
    .string()
    .min(1, 'Email is required')
    .max(50, 'Email must be 50 characters or less')
    .pipe(z.email('Please enter a valid email address')),

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

export type ContactFormData = z.infer<typeof contactFormSchema>;
