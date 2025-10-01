// app/home/resources/resources.tsx
'use client';

import React from 'react';
import styles from './resources.module.css';
import { Card } from '@components/utilities/cards/Card';
import { SchemaValidatorCard, W3CCard, SchemaDocsCard, JsonLdLearnCard, SemanticWebCard, AIsearchCard } from '.'; // barrel import

export default function ResourcesSection() {
  return (
    <section id="resources" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={`${styles.title} color-cycle`}>Resources</h2>

        <div className={styles.wrapper}>
          <div className={styles.track}>
            <Card variant="green">
              <SchemaValidatorCard />
            </Card>

            <Card variant="purple">
              <W3CCard />
            </Card>

            <Card variant="purple">
              <SchemaDocsCard />
            </Card>

            <Card variant="green">
              <JsonLdLearnCard />
            </Card>


          <Card variant="purple">
             <SemanticWebCard />
          </Card>

            <Card variant="green">
              <AIsearchCard />
            </Card>

          </div>
        </div>
      </div>
    </section>
  );
}
