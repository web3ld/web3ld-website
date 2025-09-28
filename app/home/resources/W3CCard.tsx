// app/home/resources/W3CCard.tsx
import React from 'react';
import styles from './W3CCard.module.css';

export function W3CCard() {
  return (
    <a
      className={styles.link}
      href="https://www.w3.org/TR/json-ld11/"
      target="_blank"
      rel="noreferrer"
      referrerPolicy="no-referrer"
      aria-label="Open W3C JSON-LD 1.1 specification in a new tab"
    >
      {/* decorative info icon (centered, absolute) - user-supplied shape, scaled to 120x120 */}
      <svg
        className={styles.bgIcon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 160 160"
        width="120"
        height="120"
        aria-hidden="true"
        focusable="false"
      >
        <title>info</title>
        <g fill="currentColor">
          <path d="m80 15c-35.88 0-65 29.12-65 65s29.12 65 65 65 65-29.12 65-65-29.12-65-65-65zm0 10c30.36 0 55 24.64 55 55s-24.64 55-55 55-55-24.64-55-55 24.64-55 55-55z"/>
          <path d="m57.373 18.231a9.3834 9.1153 0 1 1 -18.767 0 9.3834 9.1153 0 1 1 18.767 0z" transform="matrix(1.1989 0 0 1.2342 21.214 28.75)"/>
          <path d="m90.665 110.96c-0.069 2.73 1.211 3.5 4.327 3.82l5.008 0.1v5.12h-39.073v-5.12l5.503-0.1c3.291-0.1 4.082-1.38 4.327-3.82v-30.813c0.035-4.879-6.296-4.113-10.757-3.968v-5.074l30.665-1.105"/>
        </g>
      </svg>

      <div className={styles.content}>
        <h3 className={styles.title}>W3C — JSON-LD 1.1</h3>

        <p className={styles.body}>
          JsonLD is a terrific delivery format for semantic data.
        </p>

        <p className={styles.body}>
          See the full W3C official 1.1 specification to learn all the ins, outs and semantic structure.
        </p>
      </div>
    </a>
  );
}
