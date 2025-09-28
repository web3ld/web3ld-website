// next.config.ts
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import type { NextConfig } from "next";
import withJsonLd from "./scripts/jsonld/index-plugin";

export default (phase: string) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  const rawAllowed = process.env.NEXT_ALLOWED_DEV_ORIGINS;

  if (isDev && !rawAllowed) {
    throw new Error(
      'Missing NEXT_ALLOWED_DEV_ORIGINS env var. Set NEXT_ALLOWED_DEV_ORIGINS="http://192.168.1.39:3000" (or the exact Origin header) in .env.local'
    );
  }

  const allowedDevOrigins = rawAllowed
    ? rawAllowed.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (isDev) {
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
