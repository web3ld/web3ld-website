// app/terms/metadata.ts
import type { Metadata } from 'next';
import { env } from '../config/public';

const baseUrl = env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'An open source initiative for building the semantic web through Linked Data',
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
  openGraph: {
    title: 'Terms of Service',
    description: 'An open source initiative for building the semantic web through Linked Data',
    url: `${baseUrl}/terms`,
    siteName: 'Web3LD',
    images: [
      {
        url: `${baseUrl}/images/logos/wordmark-OG.png`,
        width: 1200,
        height: 630,
        alt: 'Web3LD wordmark',
      },
      {
        url: `${baseUrl}/images/logos/wordmark-OG-X.png`,
        width: 1200,
        height: 630,
        alt: 'Web3LD wordmark (X)',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service',
    description: 'An open source initiative for building the semantic web through Linked Data',
    site: '@rito_rhymes',
    creator: '@rito_rhymes',
    images: [`${baseUrl}/images/logos/wordmark-OG.png`],
  },
};
