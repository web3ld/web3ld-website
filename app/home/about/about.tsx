'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardVariant } from '@/components/utilities/cards/Card';
import styles from './about.module.css';

interface AboutCardData {
  variant: CardVariant;
  content: React.ReactNode;
}

const aboutCards: AboutCardData[] = [
  {
    variant: 'purple',
    content: (
      <>
        Countless bites of data are consumed and transmitted by search engines and AI, even relatively simple "schemas" can transform the context the information has and how it is used.
      </>
    )
  },
  {
    variant: 'green',
    content: (
      <>
        Web3LD helps developers and organizations implement <strong>Linked Data</strong> and <strong>JSON-LD</strong>, the building blocks of the Semantic Web.
      </>
    )
  },
  {
    variant: 'purple',
    content: (
      <>
        We envision a future where messages don&apos;t drown in a sea of lost context but can remain durable and authoritative for the sources&apos; intended meanings.
      </>
    )
  },
  {
    variant: 'green',
    content: (
      <>
        Web3LD is led by <strong>Rito</strong>, creative-strategic powerhouse and operator of{' '}
        <Link 
          href="https://ritovision.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.ritoLink}
        >
          RitoVision
        </Link>.
      </>
    )
  }
];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <h2 className={`${styles.title} color-cycle`}>About Web3LD</h2>
      
      <p className={styles.description}>
        Web3LD is an open-source initiative championing the Semantic Web by raising awareness and shipping practical infrastructure so information stays clear, portable, and machine-readable across the web.
      </p>

      <div className={styles.cardsContainer}>
        {aboutCards.map((card, index) => {
          const isFromLeft = index % 2 === 0;
          
          return (
            <motion.div
              key={index}
              className={styles.cardWrapper}
              initial={{
                opacity: 0,
                x: isFromLeft ? -48 : 48
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                opacity: { duration: 0.75, ease: "easeOut" },
                x: { duration: 1.5, ease: "easeOut" }
              }}
            >
              <Card variant={card.variant} autoHeight longWidth>
                <div className={styles.cardContent}>
                  {card.content}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}