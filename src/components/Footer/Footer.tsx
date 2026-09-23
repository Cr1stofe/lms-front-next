import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          <span>© {new Date().getFullYear()} Tiny LMS</span>
          <span>•</span>
          <span>Next.js 16</span>
        </div>
      </div>
    </footer>
  );
}
