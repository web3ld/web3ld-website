// app/home/resources/resources.tsx
'use client';

import React from 'react';
import styles from './resources.module.css';
import { Card } from '@components/utilities/cards/Card';

export default function ResourcesSection() {
  return (
    <section id="resources" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Resources</h2>

        <div className={styles.wrapper}>
          {/* Horizontal-only track (single row at all sizes) */}
          <div className={styles.track}>
            <Card variant="green" />
            <Card variant="purple" />
            <Card variant="green" />
            <Card variant="purple" />
            <Card variant="green" />
            <Card variant="purple" />
            <Card variant="green" />
            <Card variant="purple" />
          </div>
        </div>
      </div>
    </section>
  );
}
