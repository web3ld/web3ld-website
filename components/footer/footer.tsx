// components/footer/footer.tsx
import Link from "next/link";
import styles from "./footer.module.css";
import Github from "@components/utilities/socials/github";

export default function Footer() {
  // Get year server-side to avoid layout shift
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <Link href="/terms" className={`${styles.link} ${styles.terms}`}>
          Terms
        </Link>
        <div className={styles.githubWrapper}>
          <div className={styles.githubMobile}>
            <Github size={50} />
          </div>
          <div className={styles.githubDesktop}>
            <Github size={70} />
          </div>
        </div>
        <Link href="/privacy" className={`${styles.link} ${styles.privacy}`}>
          Privacy
        </Link>
      </div>
      <p className={styles.copyright}>
        Web3LD © {currentYear}
      </p>
    </footer>
  );
}