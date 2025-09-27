// components/utilities/cards/Card.tsx
import React from 'react';
import styles from './Card.module.css';

export type CardVariant = 'purple' | 'green';

export interface CardProps {
  variant: CardVariant;
  children?: React.ReactNode;
  className?: string;
}

export function Card({ variant, children, className }: CardProps) {
  return (
    <div
      className={[
        styles.card,
        variant === 'purple' ? styles.purple : styles.green,
        className ?? ''
      ].join(' ').trim()}
    >
      {children}
    </div>
  );
}

export default Card;
