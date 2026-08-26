import React from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb, { BreadcrumbItem } from "../Breadcrumb/Breadcrumb";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
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
            priority
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
                <FavoriteButton
                  isFavorite={isFavorite ?? false}
                  onToggle={onFavoriteToggle}
                  className={`${styles.iconBtn} ${styles.favoriteBtn}`}
                  ariaLabel="Favorite"
                />
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
