// app/home/resources/SchemaValidatorCard.tsx
import React from 'react';
import styles from './SchemaValidatorCard.module.css';

export function SchemaValidatorCard() {
  return (
    <a
      href="https://validator.schema.org/"
      target="_blank"
      rel="noreferrer"
      referrerPolicy="no-referrer"
      className={styles.link}
      aria-label="Open schema.org's structured data validator in a new tab"
    >
      <h3 className={styles.heading}>
        Want to make sure your semantic schemas aren&apos;t broken?
      </h3>

      <span className={styles.icon} aria-hidden="true">
        {/* var(--green) circle with a checkmark cut out */}
        <svg width="56" height="56" viewBox="0 0 56 56" role="img" aria-hidden="true">
          <defs>
            <mask id="checkCutout56">
              <rect width="56" height="56" fill="#fff" />
              <path
                d="M17 29l8 8 16-18"
                fill="none"
                stroke="#000"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
          </defs>
          <circle cx="28" cy="28" r="26" fill="var(--green)" mask="url(#checkCutout56)" />
        </svg>
      </span>

      <p className={styles.sub}>
        Check a webpage or the pasted code with schema.org&apos;s validator here.
      </p>
    </a>
  );
}
