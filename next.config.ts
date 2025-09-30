// next.config.ts
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import type { NextConfig } from "next";
import withJsonLd from "./scripts/jsonld/index-plugin";

export default (phase: string) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isCI = !!process.env.CI; // Detect if we're running in CI
  const rawAllowed = process.env.NEXT_ALLOWED_DEV_ORIGINS;

  // In CI, default to localhost for Playwright tests
  // In local dev without the var set, just warn instead of crashing
  if (isDev && !rawAllowed) {
    if (isCI) {
      // CI environment - use localhost default for testing
      // eslint-disable-next-line no-console
      console.log("➡ CI detected: Using default localhost origin for tests");
    } else {
      // Local dev environment - warn but don't crash
      // eslint-disable-next-line no-console
      console.warn(
        '⚠️  NEXT_ALLOWED_DEV_ORIGINS not set. If you need to access the dev server from other devices, ' +
        'set NEXT_ALLOWED_DEV_ORIGINS="http://192.168.1.39:3000" (or your device IP) in .env.local'
      );
    }
  }

  // Parse allowed origins, defaulting to localhost in CI
  const allowedDevOrigins = rawAllowed
    ? rawAllowed.split(",").map((s) => s.trim()).filter(Boolean)
    : isCI 
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : [];

  if (isDev && allowedDevOrigins.length > 0) {
    // eslint-disable-next-line no-console
    console.log("➡ NEXT_ALLOWED_DEV_ORIGINS (parsed):", allowedDevOrigins);
  }

  const nextConfig: NextConfig & {
    allowedDevOrigins?: string[];
    experimental?: { serverActions?: { allowedOrigins?: string[] } };
  } = {
    reactStrictMode: true,
    ...(isDev && allowedDevOrigins.length > 0 ? { allowedDevOrigins } : {}),
    experimental: {
      ...(isDev && allowedDevOrigins.length > 0
        ? { serverActions: { allowedOrigins: allowedDevOrigins } }
        : {}),
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      });
      return config;
    },
  };

  return withJsonLd(nextConfig);
};