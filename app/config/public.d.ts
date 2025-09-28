// app/config/public.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BASE_URL?: string;
    NEXT_PUBLIC_GITHUB_REPO?: string;
    NEXT_PUBLIC_CLOUDFLARE_WORKER_URL?: string;
    NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
  }
}
