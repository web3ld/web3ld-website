// app/home/hero/hero.tsx
import styles from './hero.module.css';

export default function Hero() {
  return (
    <section id="hero" className={styles.section}>
      <div className={styles.content}>
        Hero Section
      </div>
    </section>
  );
}