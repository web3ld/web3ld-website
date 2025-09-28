// app/home/resources/AIsearch.tsx
"use client";

import React from "react";
import styles from "./AIsearch.module.css";

export function AIsearchCard() {
  return (
    <a
      className={styles.link}
      href="https://writesonic.com/blog/structured-data-in-ai-search"
      target="_blank"
      rel="noreferrer"
      referrerPolicy="no-referrer"
      aria-label="Open: How AI Use Schemas for Internet Search (Writesonic) in a new tab"
      title="How AI Use Schemas for Internet Search"
    >
      <h3 className={styles.title}>How AI Use Schemas for Internet Search</h3>

      {/* big decorative robot emoji under the title */}
      <span className={styles.emoji} aria-hidden="true">🤖</span>
    </a>
  );
}
