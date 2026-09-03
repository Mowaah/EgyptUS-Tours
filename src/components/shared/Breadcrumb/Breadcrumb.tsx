"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./Breadcrumb.module.scss";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const { t } = useTranslation("common");

  return (
    <nav className={`${styles.breadcrumb} ${className}`} aria-label="Breadcrumb">
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            <Image
              src="/images/home.svg"
              alt=""
              width={16}
              height={16}
              className={styles.homeIcon}
            />
            <span>{t("nav.home", "Home")}</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.separator} aria-hidden="true">
              /
            </span>
            {item.isCurrent || !item.href ? (
              <span className={styles.current}>{item.label}</span>
            ) : (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
