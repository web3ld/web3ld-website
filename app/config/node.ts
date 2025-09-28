// app/config/node.ts
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const parsed = schema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error('❌ Invalid NODE_ENV:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid NODE_ENV');
}

const NODE_ENV = parsed.data.NODE_ENV;

/**
 * Small helper you can import anywhere (including client),
 * without referencing process.env directly.
 */
export const runtime = {
  nodeEnv: NODE_ENV,
  isDev: NODE_ENV === 'development',
  isTest: NODE_ENV === 'test',
  isProd: NODE_ENV === 'production',
} as const;

export type NodeRuntime = typeof runtime;
