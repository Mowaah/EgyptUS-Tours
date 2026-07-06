import React, { ReactNode } from "react";
import Image from "next/image";
import styles from "./FormFields.module.scss";

interface FormSectionProps {
  title?: string;
  iconSrc?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function FormSection({ title, iconSrc, children, className = "", headerAction }: FormSectionProps) {
  return (
    <section className={`${styles.section} ${className}`}>
      {(title || iconSrc || headerAction) && (
        <div className={styles.sectionHeader}>
          {iconSrc && (
            <div className={styles.sectionIcon}>
              <Image src={iconSrc} alt="" width={20} height={20} aria-hidden />
            </div>
          )}
          {title && <h2 className={styles.sectionTitle}>{title}</h2>}
          {headerAction && <div className={styles.sectionAction}>{headerAction}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
