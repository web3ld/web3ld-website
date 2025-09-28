import React from 'react';
import styles from './page.module.css';
import { loadJsonLdScripts } from '@/lib/jsonld/loadJsonFromIndex';
import termsJsonLdData from './jsonld';
export { metadata } from './metadata';

export default function TermsPage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Terms of Service</h1>
        <p className={styles.lead}>
          This is a placeholder Terms of Service. Replace these sections with your actual terms.
        </p>
      </header>

      <nav className={styles.toc} aria-label="Table of contents">
        <strong>On this page</strong>
        <ul>
          <li><a href="#agreement">Agreement</a></li>
          <li><a href="#use">Permitted Use</a></li>
          <li><a href="#accounts">Accounts</a></li>
          <li><a href="#intellectual-property">Intellectual Property</a></li>
          <li><a href="#liability">Limitation of Liability</a></li>
          <li><a href="#governing-law">Governing Law</a></li>
        </ul>
      </nav>

      <article className={styles.article}>
        <section id="agreement" className={styles.section}>
          <h2>Agreement</h2>
          <p>
            By using our service you agree to these Terms. If you do not agree, do not use the service.
          </p>
        </section>

        <section id="use" className={styles.section}>
          <h2>Permitted Use</h2>
          <p>
            You may use the service for lawful purposes only. Prohibited uses include illegal activity and attempts to circumvent security.
          </p>
        </section>

        <section id="accounts" className={styles.section}>
          <h2>Accounts</h2>
          <p>
            You are responsible for maintaining the security of your account and credentials. Notify us if you suspect unauthorized access.
          </p>
        </section>

        <section id="intellectual-property" className={styles.section}>
          <h2>Intellectual Property</h2>
          <p>
            All content provided by the service is protected by IP law. You may not reproduce or redistribute our content without permission.
          </p>
        </section>

        <section id="liability" className={styles.section}>
          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, our liability is limited. We provide services "as is" without warranties.
          </p>
        </section>

        <section id="governing-law" className={styles.section}>
          <h2>Governing Law</h2>
          <p>
            These Terms are governed by the laws of the applicable jurisdiction. Contact: <a href="mailto:legal@example.com">legal@example.com</a>.
          </p>
        </section>
      </article>

      <footer className={styles.footer}>
        <small>Last updated: <time dateTime="2025-09-27">September 27, 2025</time></small>
      </footer>
      {loadJsonLdScripts(termsJsonLdData, 'terms-jsonld')}
    </main>
  );
}