// app/config/public.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BASE_URL?: string;
    NEXT_PUBLIC_GITHUB_REPO?: string;
  }
}