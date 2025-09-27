// components/footer/edit-github-link.tsx
'use client';

import { usePathname } from 'next/navigation';
import { getGithubEditUrl } from '@config/public';
import styles from './footer.module.css';

export default function EditGithubLink() {
  const pathname = usePathname();
  const githubEditUrl = getGithubEditUrl(pathname);
  
  return (
    <a 
      href={githubEditUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.editLink}
    >
      Edit page on GitHub
    </a>
  );
}