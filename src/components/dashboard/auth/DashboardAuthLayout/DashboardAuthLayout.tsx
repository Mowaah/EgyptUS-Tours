import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./DashboardAuthLayout.module.scss";

interface DashboardAuthLayoutProps {
  children: ReactNode;
  compactTop?: boolean;
}

export default function DashboardAuthLayout({
  children,
  compactTop = false,
}: DashboardAuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.heroSide} aria-hidden={false}>
          <div className={styles.hero}>
            <Image
              src="/images/home/hero-bg.png"
              alt=""
              fill
              priority
              quality={100}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={styles.heroImage}
            />
            <Image
              src="/images/logo-white.svg"
              alt="Egypt-Us"
              width={150}
              height={36}
              className={styles.heroLogo}
            />
          </div>
        </section>

        <section className={styles.formSide}>
          <div className={styles.formCard}>
            <div
              className={`${styles.formBody} ${
                compactTop ? styles.formBodyCompact : ""
              }`}
            >
              {children}

              <div className={styles.decoration} aria-hidden>
                <Image
                  src="/images/dotted-line7.svg"
                  alt=""
                  width={282}
                  height={413}
                  className={styles.dottedLine}
                />
              </div>
            </div>

            <footer className={styles.footer}>
              <p>&copy; 2026 Egypt-Us | EG. All rights reserved.</p>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
}
