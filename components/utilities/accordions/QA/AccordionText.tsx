import React from 'react';
import styles from './AccordionText.module.css';
import type { AccordionVariant } from './types';
// Context is included for future inheritance, but not used by default yet.
// import { useAccordionVariant } from './variant-context';

export interface AccordionTextProps {
  /** Single heading (replaces previous title+heading pair) */
  heading?: string;
  /** Body copy; paragraphs split by double newline */
  text: string;
  /** Explicitly control styling for this text block */
  variant?: AccordionVariant; // defaults to 'purple' here
}

export function AccordionText({ heading, text, variant = 'purple' }: AccordionTextProps) {
  // For parent->child variant inheritance later:
  // const ctx = useAccordionVariant();
  // const resolvedVariant = variant ?? ctx;

  const variantClass = variant === 'green' ? styles.variantGreen : styles.variantPurple;
  const paragraphs = text.split('\n\n');

  return (
    <div className={`${styles.container} ${variantClass}`}>
      {heading && <h4 className={styles.textHeading}>{heading}</h4>}
      {paragraphs.map((para, i) => (
        <p key={i} className={styles.textBody}>{para}</p>
      ))}
    </div>
  );
}

export default AccordionText;
