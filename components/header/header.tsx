// components/header/header.tsx
import Link from "next/link";
import styles from "./header.module.css";
import Github from "@components/utilities/socials/github";
export default function Header() {
  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />
      <header className={styles.fixed}>
        <div className={styles.inner}>
          {/* Left: GitHub (render both sizes, toggle via CSS) */}
          <div className={styles.left}>
            <div className={styles.githubMobile}>
              <Github size={28} />
            </div>
            <div className={styles.githubDesktop}>
              <Github size={30} />
            </div>
          </div>
          {/* Center: Logo -> root */}
          <Link href="/" className={styles.center} aria-label="web3LD home">
            <img
              src="/images/logos/wordmark.png"
              alt="web3LD"
              className={styles.logo}
            />
          </Link>
          {/* Right: reserved for hamburger */}
          <div className={styles.right}>
            <div className={styles.hamburger} aria-hidden="true" />
          </div>
        </div>
      </header>
    </>
  );
}