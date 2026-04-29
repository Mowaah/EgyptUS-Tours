import React from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb, { BreadcrumbItem } from "../Breadcrumb/Breadcrumb";
import styles from "./PageHeader.module.scss";

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  backButton?: {
    text: string;
    href: string;
  };
  rightActions?: React.ReactNode;
  showMobileActions?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onShare?: () => void;
  decorationSrc?: string;
  className?: string; // Appended to the outer wrapper
  titleMaxWidth?: string;
  subtitleMaxWidth?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  breadcrumbs,
  title,
  subtitle,
  backButton,
  rightActions,
  showMobileActions,
  isFavorite,
  onFavoriteToggle,
  onShare,
  decorationSrc,
  className = "",
  titleMaxWidth,
  subtitleMaxWidth,
  children,
}: PageHeaderProps) {
  return (
    <div className={`${styles.headerWrapper} ${className}`}>
      {decorationSrc && (
        <div className={styles.decorationWrapper}>
          <Image
            src={decorationSrc}
            alt=""
            width={340}
            height={247}
            className={styles.decoration}
            aria-hidden="true"
          />
        </div>
      )}

      <div className={styles.container}>
        {(backButton || rightActions) && (
          <div className={styles.topRow}>
            {backButton && (
              <Link className={styles.backButton} href={backButton.href}>
                <Image
                  src="/images/arrows/arrow-right-blue.svg"
                  alt=""
                  width={24}
                  height={24}
                  className={styles.backArrow}
                  aria-hidden="true"
                />
                {backButton.text}
              </Link>
            )}
            {rightActions && <div className={styles.rightActions}>{rightActions}</div>}
          </div>
        )}

        {(breadcrumbs && breadcrumbs.length > 0 || showMobileActions) && (
          <div className={styles.breadcrumbRow}>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb items={breadcrumbs} className={styles.breadcrumbComp} />
            )}
            {showMobileActions && (
              <div className={styles.mobileActions}>
                <button className={`${styles.iconBtn} ${isFavorite ? styles.favoriteActive : ""}`} aria-label="Favorite" onClick={onFavoriteToggle}>
                  <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className={styles.favoriteIcon}>
                    <path d="M13.7001 2.58203C12.1917 2.58203 10.8417 3.31536 10.0001 4.44036C9.15841 3.31536 7.80841 2.58203 6.30008 2.58203C3.74175 2.58203 1.66675 4.66536 1.66675 7.24036C1.66675 8.23203 1.82508 9.1487 2.10008 9.9987C3.41675 14.1654 7.47508 16.657 9.48341 17.3404C9.76675 17.4404 10.2334 17.4404 10.5167 17.3404C12.5251 16.657 16.5834 14.1654 17.9001 9.9987C18.1751 9.1487 18.3334 8.23203 18.3334 7.24036C18.3334 4.66536 16.2584 2.58203 13.7001 2.58203Z" />
                  </svg>
                </button>
                <button className={`${styles.iconBtn} ${styles.shareBtn}`} aria-label="Share" onClick={onShare}>
                  <Image src="/images/share.svg" alt="Share" width={18} height={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {title && (
          <h1
            className={styles.title}
            style={titleMaxWidth ? { maxWidth: titleMaxWidth } : undefined}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <p
            className={styles.subtitle}
            style={subtitleMaxWidth ? { maxWidth: subtitleMaxWidth } : undefined}
          >
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
