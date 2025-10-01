'use client';

import { motion } from 'framer-motion';
import { Card, CardVariant } from '@/components/utilities/cards/Card';
import styles from './about.module.css';

interface AboutCardData {
  variant: CardVariant;
  content: string;
}

const aboutCards: AboutCardData[] = [
  {
    variant: 'purple',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
  {
    variant: 'green',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    variant: 'purple',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
  },
  {
    variant: 'green',
    content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <h2 className={`${styles.title} color-cycle`}>About Web3LD</h2>
      
      <p className={styles.description}>
        This is placeholder text that will be replaced with actual content about Web3LD and what we do.
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