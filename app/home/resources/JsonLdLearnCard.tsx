// app/home/resources/JsonLdLearnCard.tsx
"use client";

import React from "react";
import styles from "./JsonLdLearnCard.module.css";

type Props = {
  size?: number;        // width/height in px (square)
  className?: string;
  title?: string;
};

/**
 * JsonLdLearnCard
 * - client component
 * - uses a regular <img> served from public/images/brands/json-ld-org.png
 * - default size 140px, opacity 0.8
 */
export default function JsonLdLearnCard({
  size = 140,
  className = "",
  title = "JSON-LD Learning Resources",
}: Props) {
  const px = Math.max(24, Math.min(400, Math.round(size)));
  const src = "/images/brands/json-ld-org.png"; // public/ path

  return (
    <a
      href="https://json-ld.org/learn/"
      className={`${styles.root} ${className}`.trim()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title}
      title={title}
    >
      <h3 className={styles.title}>JsonLD and Schemas work together!</h3>

      <div className={styles.imgWrap} aria-hidden="true">
        <img
          src={src}
          className={styles.img}
          style={{ width: `${px}px`, height: `${px}px`, opacity: 0.8 }}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </div>

      <p className={styles.body}>
        Learn how to apply them with these insightful articles and videos.
      </p>
    </a>
  );
}
