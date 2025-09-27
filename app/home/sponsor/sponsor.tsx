// app/home/sponsor/sponsor.tsx
'use client';

import React from 'react';
import styles from './sponsor.module.css';

export default function SponsorSection() {
  return (
    <section id="sponsor" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Sponsored by</h2>

        <div className={styles.stack}>
          <a
            href="https://ritovision.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/sponsors/ritovision-wordmark.png"
              alt="Ritovision wordmark"
              className={styles.logo}
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
