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
  decorationSrc?: string;
  className?: string; // Appended to the outer wrapper
  titleMaxWidth?: string;
  subtitleMaxWidth?: string;
}

export default function PageHeader({
  breadcrumbs,
  title,
  subtitle,
  backButton,
  decorationSrc,
  className = "",
  titleMaxWidth,
  subtitleMaxWidth,
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

        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} className={styles.breadcrumbComp} />
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
      </div>
    </div>
  );
}
