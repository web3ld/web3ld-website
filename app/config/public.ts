// app/config/public.ts
import { z } from 'zod';
import { runtime } from './node';

export { runtime };

/*Specify client-side environment variables schema here. */

const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().optional().default('https://web3ld.org'),
  NEXT_PUBLIC_GITHUB_REPO: z
    .string()
    .optional()
    .default('https://github.com/web3ld/web3ld-website'),
  NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: z.string().optional().default(''),
  // Turnstile site key lives in public config
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional().default(''),
});

const envVars = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_GITHUB_REPO: process.env.NEXT_PUBLIC_GITHUB_REPO,
  NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
};

// Validate the environment variables
const parsedEnv = envSchema.safeParse(envVars);
if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;

/**
 * Helper function to generate GitHub edit URL for a given page path
 * @param pathname - The current page pathname (e.g., '/about', '/blog/post-1')
 * @returns The GitHub edit URL for the corresponding file
 */
export function getGithubEditUrl(pathname: string): string {
  const repo = env.NEXT_PUBLIC_GITHUB_REPO;
  const branch = 'master';

  // Map the pathname to the actual file path
  let filePath: string;

  if (pathname === '/') {
    filePath = 'app/page.tsx';
  } else {
    // Remove leading slash and handle nested routes
    const cleanPath = pathname.replace(/^\//, '');
    // Check if it's likely a dynamic route, API route, or regular page
    filePath = `app/${cleanPath}/page.tsx`;
  }

  const repoPath = repo.replace('https://github.com/', '');
  return `https://github.com/${repoPath}/edit/${branch}/${filePath}`;
}
