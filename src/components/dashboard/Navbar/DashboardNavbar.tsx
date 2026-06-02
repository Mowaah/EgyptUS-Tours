"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import styles from "./DashboardNavbar.module.scss";

interface DashboardNavbarProps {
  title?: string;
  subtitle?: string;
  breadcrumbLabel?: string;
}

const pageCopyByPath: Record<
  string,
  { title: string; subtitle: string; breadcrumbLabel: string; showAddLead?: boolean }
> = {
  "/dashboard": {
    title: "Dashboard Overview",
    subtitle: "Let's review your update for today",
    breadcrumbLabel: "Home",
  },
  "/dashboard/leads": {
    title: "Leads & Inquiries",
    subtitle: "Track and manage all incoming customer inquiries.",
    breadcrumbLabel: "Leads & Inquiries",
    showAddLead: true,
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
  const currentBreadcrumb = breadcrumbLabel ?? pageCopy.breadcrumbLabel;
  const isDashboardHome = pathname === "/dashboard";

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
          {!isDashboardHome ? (
            <>
              <ChevronRightIcon />
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {currentBreadcrumb}
              </span>
            </>
          ) : null}
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
            <input type="search" placeholder="Search bookings, customers..." />
          </label>

          {pageCopy.showAddLead ? (
            <button type="button" className={styles.addLeadButton}>
              Add Lead
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
