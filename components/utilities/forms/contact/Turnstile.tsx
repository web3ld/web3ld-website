// components/utilities/forms/contact/Turnstile.tsx
'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { env, runtime } from '@config/public';

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  appearance?: 'always' | 'execute' | 'interaction-only';
}

declare global {
  interface Window {
    turnstile: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: string;
          size?: string;
          appearance?: string;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function Turnstile({
  onVerify,
  onExpire,
  onError,
  theme = 'dark',
  size = 'normal',
  appearance = 'always',
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const renderTurnstile = () => {
      if (!mounted || !containerRef.current || !window.turnstile) return;

      // Use Cloudflare test key in dev/test; otherwise use public config
      const sitekey =
        runtime.isDev || runtime.isTest
          ? '1x00000000000000000000AA' // Cloudflare test key - always passes
          : env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

      if (!sitekey && runtime.isProd) {
        console.error('Turnstile site key not configured');
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey,
        callback: onVerify,
        'expired-callback': onExpire,
        'error-callback': onError,
        theme,
        size,
        appearance,
      });
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderTurnstile();
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 10000);
    }

    return () => {
      mounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // no-op
        }
      }
    };
  }, [onVerify, onExpire, onError, theme, size, appearance]);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <div ref={containerRef} />
    </>
  );
}
