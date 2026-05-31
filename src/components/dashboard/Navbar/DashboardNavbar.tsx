"use client";

import Image from "next/image";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import styles from "./DashboardNavbar.module.scss";

interface DashboardNavbarProps {
  title?: string;
  subtitle?: string;
  breadcrumbLabel?: string;
}

const pageCopyByPath: Record<string, { title: string; subtitle: string; breadcrumbLabel: string }> = {
  "/dashboard": {
    title: "Dashboard Overview",
    subtitle: "Let's review your update for today",
    breadcrumbLabel: "Home",
  },
};

const toTitleCase = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function ChevronRightIcon() {
  return (
    <svg className={styles.chevronIcon} viewBox="0 0 16 16" aria-hidden="true">
      <path d="m6 3.5 4 4.5-4 4.5" />
    </svg>
  );
}

export default function DashboardNavbar({
  title,
  subtitle,
  breadcrumbLabel,
}: DashboardNavbarProps) {
  const pathname = usePathname();

  const pageCopy = useMemo(() => {
    if (pathname && pageCopyByPath[pathname]) {
      return pageCopyByPath[pathname];
    }

    const currentSegment = pathname?.split("/").filter(Boolean).at(-1) ?? "dashboard";
    const label = toTitleCase(currentSegment);

    return {
      title: `${label} Overview`,
      subtitle: `Manage ${label.toLowerCase()} activity`,
      breadcrumbLabel: label,
    };
  }, [pathname]);

  const visibleTitle = title ?? pageCopy.title;
  const visibleSubtitle = subtitle ?? pageCopy.subtitle;
  const visibleBreadcrumb = breadcrumbLabel ?? pageCopy.breadcrumbLabel;

  return (
    <header className={styles.navbar}>
      <div className={styles.topRow}>
        <a href="/dashboard" className={styles.breadcrumb} aria-label="Go to dashboard home">
          <Image
            src="/images/dashboard/navbar/home.svg"
            alt=""
            width={20}
            height={20}
            className={styles.icon}
            aria-hidden
          />
          <ChevronRightIcon />
          <span>{visibleBreadcrumb}</span>
        </a>

        <button className={styles.notificationButton} type="button" aria-label="Notifications">
          <Image
            src="/images/dashboard/navbar/notification-bing.svg"
            alt=""
            width={24}
            height={24}
            className={styles.notificationIcon}
            aria-hidden
          />
          <span className={styles.notificationDot} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.heading}>
          <h1>{visibleTitle}</h1>
          <p>{visibleSubtitle}</p>
        </div>

        <div className={styles.tools}>
          <button className={styles.filterButton} type="button" aria-label="Filter dashboard results">
            <Image
              src="/images/dashboard/navbar/filter.svg"
              alt=""
              width={24}
              height={24}
              className={styles.actionIcon}
              aria-hidden
            />
          </button>

          <label className={styles.searchBox}>
            <Image
              src="/images/dashboard/navbar/search.svg"
              alt=""
              width={24}
              height={24}
              className={styles.actionIcon}
              aria-hidden
            />
            <span className={styles.srOnly}>Search dashboard</span>
            <input type="search" placeholder="Search bookings, customers..." />
          </label>
        </div>
      </div>
    </header>
  );
}
