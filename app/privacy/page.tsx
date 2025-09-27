import React from 'react';
import styles from './page.module.css';
import { metadata } from './metadata';
export { metadata };

export default function PrivacyPage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Privacy Policy</h1>
        <p className={styles.lead}>
          This is a placeholder privacy policy. Replace the sections below with your actual policy text.
        </p>
      </header>

      <nav className={styles.toc} aria-label="Table of contents">
        <strong>On this page</strong>
        <ul>
          <li><a href="#introduction">Introduction</a></li>
          <li><a href="#data-collection">Data Collection</a></li>
          <li><a href="#cookies">Cookies & Tracking</a></li>
          <li><a href="#user-rights">Your Rights</a></li>
          <li><a href="#data-security">Data Security</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <article className={styles.article}>
        <section id="introduction" className={styles.section}>
          <h2>Introduction</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae eros eget tellus tristique bibendum.
            Donec rutrum sed sem quis venenatis.
          </p>
        </section>

        <section id="data-collection" className={styles.section}>
          <h2>Data Collection</h2>
          <p>
            We collect information you provide directly to us (for example, account registration) and information collected automatically
            when you use our services (for example, usage data and device information).
          </p>
          <h3>Information you provide</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </section>

        <section id="cookies" className={styles.section}>
          <h2>Cookies & Tracking</h2>
          <p>
            We use cookies and similar technologies to provide, protect and improve our services, such as to remember your preferences and
            analyze site traffic.
          </p>
        </section>

        <section id="user-rights" className={styles.section}>
          <h2>Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights to access, correct, or delete your personal data, and to restrict or object
            to certain processing. Contact us to exercise these rights.
          </p>
        </section>

        <section id="data-security" className={styles.section}>
          <h2>Data Security</h2>
          <p>
            We take reasonable measures to protect your information, but no method of transmission or storage is 100% secure.
          </p>
        </section>

        <section id="contact" className={styles.section}>
          <h2>Contact</h2>
          <p>
            For questions about this privacy policy, email: <a href="mailto:privacy@example.com">privacy@example.com</a>.
          </p>
        </section>
      </article>

      <footer className={styles.footer}>
        <small>Last updated: <time dateTime="2025-09-27">September 27, 2025</time></small>
      </footer>
    </main>
  );
}
