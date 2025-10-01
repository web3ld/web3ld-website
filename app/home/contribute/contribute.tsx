// app/home/contribute/contribute.tsx
'use client';

import Link from 'next/link';
import styles from './contribute.module.css';

export default function ContributeSection() {
  return (
    <section id="contribute" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>How to Contribute</h2>

        <div className={styles.stack}>
          <p className={styles.text}>
            Web3LD is an open-source initiative, and as such, we have a presence on{' '}
            <Link
              href="https://github.com/web3ld"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub
            </Link>
            . You are welcome to open issues for requests or suggestions, or make pull requests to
            enhance the project website. Please review any contribution guidelines beforehand.
          </p>

          <p className={styles.text}>
            There is also a{' '}
            <Link href="#contact" className={styles.link}>
              contact form
            </Link>{' '}
            on this page if you would like to suggest a particular project that needs help with
            expanding its semantic-web footprint.
          </p>

          <p className={styles.text}>
            And lastly, just getting out there, learning about the semantic web, and applying it to
            your project, or sharing it with others, helps support our mission!
          </p>
        </div>
      </div>
    </section>
  );
}
