// components/utilities/cards/Card.tsx
import React from 'react';
import styles from './Card.module.css';

export type CardVariant = 'purple' | 'green';

export interface CardProps {
  variant: CardVariant;
  children?: React.ReactNode;
  className?: string;
  autoHeight?: boolean;
  longWidth?: boolean;
}

export function Card({ variant, children, className, autoHeight = false, longWidth = false }: CardProps) {
  const classes = [
    styles.card,
    autoHeight ? styles.autoHeight : '',
    longWidth ? styles.longWidth : '',
    variant === 'purple' ? styles.purple : styles.green,
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

export default Card;