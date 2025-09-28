import React from 'react';
import styles from './page.module.css';
import { metadata } from './metadata';
import { loadJsonLdScripts } from '@/lib/jsonld/loadJsonFromIndex';
import privacyJsonLdData from './jsonld';
export { metadata };

export default function PrivacyPage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Privacy Policy</h1>
        <p className={styles.lead}>
          This Privacy Policy explains how Web3LD (“Web3LD,” “we,” “us,” or “our”) collects, uses, and protects personal information in connection with the website <a href="https://web3ld.org" className={styles.link}>web3ld.org</a>.
        </p>
      </header>

      <nav className={styles.toc} aria-label="Table of contents">
        <strong>On this page</strong>
        <ul>
          <li><a href="#introduction">Introduction</a></li>
          <li><a href="#data-collection">Information We Collect</a></li>
          <li><a href="#use-of-information">How We Use Information</a></li>
          <li><a href="#cookies">Cookies & Tracking</a></li>
          <li><a href="#sharing">Sharing of Information</a></li>
          <li><a href="#retention">Data Retention</a></li>
          <li><a href="#data-security">Data Security</a></li>
          <li><a href="#childrens-privacy">Children’s Privacy</a></li>
          <li><a href="#user-rights">Your Rights</a></li>
          <li><a href="#changes">Changes to This Policy</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <article className={styles.article}>
        <section id="introduction" className={styles.section}>
          <h2>Introduction</h2>
          <p>
            Web3LD operates the website <a href="https://web3ld.org">web3ld.org</a> (the “Site”). This Privacy Policy describes what personal
            information we collect, how we use it, and the choices you have. This policy applies only to information collected through the
            Site and not to information collected offline.
          </p>
        </section>

        <section id="data-collection" className={styles.section}>
          <h2>Information We Collect</h2>
          <p>
            We only collect personal information that you voluntarily provide through our contact form. Specifically, the form may request:
          </p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Business and/or project name</li>
          </ul>
          <p>
            We do not otherwise collect personal information through the Site, and we do not collect usage analytics or device identifiers.
          </p>
        </section>

        <section id="use-of-information" className={styles.section}>
          <h2>How We Use Information</h2>
          <p>
            We use the information you submit via the contact form solely for the purpose of responding to your inquiry and engaging with
            you about Web3LD services, projects, or collaborations.
          </p>
        </section>

        <section id="cookies" className={styles.section}>
          <h2>Cookies & Tracking</h2>
          <p>
            We do not use cookies or similar tracking technologies on the Site. We also do not use third-party analytics, advertising
            networks, pixels, or beacons.
          </p>
        </section>

        <section id="sharing" className={styles.section}>
          <h2>Sharing of Information</h2>
          <p>
            We do not sell personal information to advertisers or other third parties. We may disclose information if required by law,
            regulation, or legal process, or to protect the rights, property, or safety of Web3LD, our users, or others.
          </p>
        </section>

        <section id="retention" className={styles.section}>
          <h2>Data Retention</h2>
          <p>
            We retain contact form submissions for as long as necessary to respond to and manage the inquiry and reasonable follow-up.
            If no longer needed, we aim to delete or de-identify submissions within 24 months, unless a longer retention period is required
            by law or necessary to establish, exercise, or defend legal claims.
          </p>
        </section>

        <section id="data-security" className={styles.section}>
          <h2>Data Security</h2>
          <p>
            We implement reasonable administrative, technical, and physical safeguards designed to protect personal information. However,
            no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        <section id="childrens-privacy" className={styles.section}>
          <h2>Children’s Privacy</h2>
          <p>
            The Site is not directed to children under 13, and we do not knowingly collect personal information from children under 13.
            If you believe a child has provided us with personal information, please contact us and we will take appropriate steps to remove it.
          </p>
        </section>

        <section id="user-rights" className={styles.section}>
          <h2>Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal information, such as the right to access, correct,
            or delete your information. You may also have the right to object to or restrict certain processing. To exercise these rights,
            please contact us using the method below.
          </p>
        </section>

        <section id="changes" className={styles.section}>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The “Last updated” date below indicates when this policy was last revised.
            Any changes become effective when posted on this page.
          </p>
        </section>

        <section id="contact" className={styles.section}>
          <h2>Contact</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us through the contact form on our <a href="/#contact" aria-label="Web3LD homepage">homepage</a>.
          </p>
          <p>
            Organization: Web3LD<br />
            Website: <a href="https://web3ld.org">web3ld.org</a>
          </p>
        </section>
      </article>

      <footer className={styles.footer}>
        <small>Last updated: <time dateTime="2025-09-27">September 27, 2025</time></small>
      </footer>
      {loadJsonLdScripts(privacyJsonLdData, 'privacy-jsonld')}
    </main>
  );
}
