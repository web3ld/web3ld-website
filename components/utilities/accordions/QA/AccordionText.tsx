import React from 'react';
import styles from './AccordionText.module.css';
import type { AccordionVariant } from './types';

export interface AccordionTextProps {
  /** Single heading (replaces previous title+heading pair) */
  heading?: string;
  /** Body copy; paragraphs split by double newline (unless renderHTML is true) */
  text: string;
  /** Explicitly control styling for this text block */
  variant?: AccordionVariant; // defaults to 'purple' here
  /**
   * When true, render `text` as HTML (e.g., allows <strong>, <br />, <em>, lists).
   * Use only with trusted content that you control.
   */
  renderHTML?: boolean;
}

export function AccordionText({
  heading,
  text,
  variant = 'purple',
  renderHTML = false,
}: AccordionTextProps) {
  const variantClass = variant === 'green' ? styles.variantGreen : styles.variantPurple;

  return (
    <div className={`${styles.container} ${variantClass}`}>
      {heading && <h4 className={styles.textHeading}>{heading}</h4>}
      {renderHTML ? (
        <div
          className={styles.textBody}
          // NOTE: Only use with trusted content you control.
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ) : (
        text.split('\n\n').map((para, i) => (
          <p key={i} className={styles.textBody}>
            {para}
          </p>
        ))
      )}
    </div>
  );
}

export default AccordionText;
