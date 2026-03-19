import Image from "next/image";
import styles from "./TopBar.module.scss";

export default function TopBar() {
  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div className={styles.socials}>
          <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>
            <Image src="/images/linkedin.svg" alt="LinkedIn" width={14} height={14} />
          </a>
          <a href="#" aria-label="Facebook" className={styles.socialIcon}>
            <Image src="/images/facebook.svg" alt="Facebook" width={16} height={16} />
          </a>
          <a href="#" aria-label="X" className={styles.socialIcon}>
            <Image src="/images/x.svg" alt="X" width={14} height={14} />
          </a>
        </div>

        <div className={styles.language}>
          <Image src="/images/en.svg" alt="English" width={18} height={18} />
          <span>EN</span>
          <Image src="/images/arrow-down.svg" alt="" width={16} height={16} />
        </div>
      </div>
    </div>
  );
}
