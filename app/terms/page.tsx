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
          These Terms of Service (“Terms”) govern your use of the website <a href="https://web3ld.org">web3ld.org</a> (the “Site”) operated by Web3LD (“Web3LD,” “we,” “us,” or “our”).
          By accessing or using the Site, you agree to these Terms.
        </p>
      </header>

      <nav className={styles.toc} aria-label="Table of contents">
        <strong>On this page</strong>
        <ul>
          <li><a href="#overview">Overview</a></li>
          <li><a href="#open-source">Open Source & Licensing</a></li>
          <li><a href="#nonprofit">Non-Profit / Non-Commercial</a></li>
          <li><a href="#use">Permitted Use (Informational Only)</a></li>
          <li><a href="#accounts">No Accounts</a></li>
          <li><a href="#no-partnership">No Partnership from Submissions</a></li>
          <li><a href="#intellectual-property">Intellectual Property</a></li>
          <li><a href="#disclaimer">Disclaimers</a></li>
          <li><a href="#liability">Limitation of Liability</a></li>
          <li><a href="#third-parties">Third-Party Links & Repositories</a></li>
          <li><a href="#changes">Changes to These Terms</a></li>
          <li><a href="#governing-law">Governing Law & Venue</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <article className={styles.article}>
        <section id="overview" className={styles.section}>
          <h2>Overview</h2>
          <p>
            The Site is provided for informational purposes only. Web3LD develops and maintains an open-source project; all code and infrastructure are made available publicly.
          </p>
        </section>

        <section id="open-source" className={styles.section}>
          <h2>Open Source & Licensing</h2>
          <p>
            Except as noted in this Section, the project’s source code and infrastructure are open source and generally licensed under the MIT License (or another permissive open-source license as specified in the relevant repository). Your rights to use, copy, modify, and distribute the code are governed by the applicable license file included with that code. In the event of any conflict between these Terms and an open-source license applicable to the code, the open-source license controls for the code covered by it.
          </p>
        </section>

        <section id="nonprofit" className={styles.section}>
          <h2>Non-Profit / Non-Commercial</h2>
          <p>
            Web3LD is not a for-profit entity. The Site does not offer paid accounts or commercial services through the Site.
          </p>
        </section>

        <section id="use" className={styles.section}>
          <h2>Permitted Use (Informational Only)</h2>
          <p>
            You may use the Site for lawful, informational purposes. You may not use the Site in any manner that violates applicable law, infringes others’ rights, attempts to gain unauthorized access to systems or data, or interferes with the operation or security of the Site.
          </p>
        </section>

        <section id="accounts" className={styles.section}>
          <h2>No Accounts</h2>
          <p>
            The Site does not provide user accounts or registrations. There are no login credentials, user profiles, or account-based features.
          </p>
        </section>

        <section id="no-partnership" className={styles.section}>
          <h2>No Partnership from Submissions</h2>
          <p>
            Submitting information through the Site’s contact form does not create a partnership, joint venture, employment, fiduciary, agency, or other relationship between you and Web3LD. Any discussions initiated through the contact form are exploratory only unless and until a separate written agreement is executed.
          </p>
        </section>

        <section id="intellectual-property" className={styles.section}>
          <h2>Intellectual Property</h2>
          <p>
            Code and infrastructure are licensed as described in <a href="#open-source">Open Source & Licensing</a>. The Web3LD name, logos, branding, and other identifiers (the “Marks”) are protected by trademark and other intellectual property laws. Except for nominative fair use, you may not use the Marks without our prior written permission. No license to the Marks is granted by making the code available under an open-source license.
          </p>
        </section>

        <section id="disclaimer" className={styles.section}>
          <h2>Disclaimers</h2>
          <p>
            THE SITE AND ANY INFORMATION MADE AVAILABLE THROUGH IT ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WITHOUT LIMITATION WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE. Web3LD does not warrant that the Site will be uninterrupted, secure, or error-free.
          </p>
          <p>
            Information on the Site is for general informational purposes only and should not be relied upon as professional advice.
          </p>
        </section>

        <section id="liability" className={styles.section}>
          <h2>Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WEB3LD AND ITS CONTRIBUTORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE SITE OR THE OPEN-SOURCE CODE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. TO THE EXTENT ANY LIABILITY IS NOT EXCLUDABLE, THE AGGREGATE LIABILITY OF WEB3LD AND ITS CONTRIBUTORS WILL NOT EXCEED ONE HUNDRED U.S. DOLLARS (US$100).
          </p>
        </section>

        <section id="third-parties" className={styles.section}>
          <h2>Third-Party Links & Repositories</h2>
          <p>
            The Site may reference or link to third-party sites, services, or repositories. We are not responsible for third-party content, policies, or practices. Your use of third-party resources is at your own risk and subject to their terms.
          </p>
        </section>

        <section id="changes" className={styles.section}>
          <h2>Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. The “Last updated” date below indicates when these Terms were most recently revised. Changes take effect when posted on this page.
          </p>
        </section>

        <section id="governing-law" className={styles.section}>
          <h2>Governing Law & Venue</h2>
          <p>
            These Terms and any dispute, claim, or controversy arising out of or relating to them or the Site will be governed by and construed in accordance with the laws of the State of Delaware, U.S.A., without regard to its conflict-of-laws rules. You agree to the exclusive jurisdiction and venue of the state and federal courts located in Delaware for any such dispute, and you waive any objection to jurisdiction, venue, or inconvenient forum.
          </p>
        </section>

        <section id="contact" className={styles.section}>
          <h2>Contact</h2>
          <p>
            Questions about these Terms? Contact us via the contact form on our <a href="/#contact" aria-label="Web3LD homepage">homepage</a>.
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
      {loadJsonLdScripts(termsJsonLdData, 'terms-jsonld')}
    </main>
  );
}
