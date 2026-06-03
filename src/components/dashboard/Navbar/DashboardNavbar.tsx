"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import styles from "./DashboardNavbar.module.scss";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface DashboardNavbarProps {
  title?: string;
  subtitle?: string;
  breadcrumbTrail?: BreadcrumbSegment[];
  onPrimaryAction?: () => void;
}

interface PageCopy {
  title: string;
  subtitle: string;
  breadcrumbTrail: BreadcrumbSegment[];
  searchPlaceholder?: string;
  primaryAction?: { label: string };
}

const pageCopyByPath: Record<string, PageCopy> = {
  "/dashboard": {
    title: "Dashboard Overview",
    subtitle: "Let's review your update for today",
    breadcrumbTrail: [],
  },
  "/dashboard/leads": {
    title: "Leads & Inquiries",
    subtitle: "Track and manage all incoming customer inquiries.",
    breadcrumbTrail: [{ label: "Leads & Inquiries" }],
    primaryAction: { label: "Add Lead" },
  },
  "/dashboard/settings/user-management": {
    title: "User Management",
    subtitle: "Manage and organize all system users, control access levels",
    breadcrumbTrail: [{ label: "Settings" }, { label: "User Management" }],
    searchPlaceholder: "Search names, emails...",
    primaryAction: { label: "New Admin" },
  },
};

const toTitleCase = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export function ChevronRightIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={`${styles.chevronIcon} ${className || ""}`.trim()} viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="m6 3.5 4 4.5-4 4.5" />
    </svg>
  );
}

export default function DashboardNavbar({
  title,
  subtitle,
  breadcrumbTrail,
  onPrimaryAction,
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
      breadcrumbTrail: [{ label }],
    };
  }, [pathname]);

  const visibleTitle = title ?? pageCopy.title;
  const visibleSubtitle = subtitle ?? pageCopy.subtitle;
  const visibleTrail = breadcrumbTrail ?? pageCopy.breadcrumbTrail;
  const searchPlaceholder =
    pageCopy.searchPlaceholder ?? "Search bookings, customers...";

  return (
    <header className={styles.navbar}>
      <div className={styles.topRow}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/dashboard" className={styles.breadcrumbLink}>
            <Image
              src="/images/dashboard/navbar/home.svg"
              alt=""
              width={20}
              height={20}
              className={styles.icon}
              aria-hidden
            />
            <span>Home</span>
          </Link>
          {visibleTrail.map((segment, index) => {
            const isLast = index === visibleTrail.length - 1;

            return (
              <span key={`${segment.label}-${index}`} className={styles.breadcrumbSegment}>
                <ChevronRightIcon />
                {segment.href && !isLast ? (
                  <Link href={segment.href} className={styles.breadcrumbLink}>
                    {segment.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? styles.breadcrumbCurrent : styles.breadcrumbMuted}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {segment.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>

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
            <input type="search" placeholder={searchPlaceholder} />
          </label>

          {pageCopy.primaryAction ? (
            <button
              type="button"
              className={styles.primaryActionButton}
              onClick={onPrimaryAction}
            >
              {pageCopy.primaryAction.label}
              <Image
                src="/images/dashboard/navbar/add-circle.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
              />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
