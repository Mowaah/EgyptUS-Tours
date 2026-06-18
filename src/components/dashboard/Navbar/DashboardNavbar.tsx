"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import pageCopyByPath, { type BreadcrumbSegment } from "./navbarPageCopy";
import styles from "./DashboardNavbar.module.scss";


interface ActionConfig {
  label: string;
  form?: string;
  type?: "button" | "submit" | "reset";
  iconSrc?: string;
  iconRotation?: number;
  hideIcon?: boolean;
}

interface DashboardNavbarProps {
  title?: string;
  subtitle?: string;
  breadcrumbTrail?: BreadcrumbSegment[];
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  children?: React.ReactNode;
  hideFilterButton?: boolean;
  hideSearch?: boolean;
  hidePrimaryAction?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}


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
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
  children,
  hideFilterButton,
  hideSearch,
  hidePrimaryAction,
  searchQuery,
  onSearchChange,
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
  const visiblePrimaryAction = primaryAction ?? pageCopy.primaryAction;
  const visibleSecondaryAction = secondaryAction ?? pageCopy.secondaryAction;
  const searchPlaceholder =
    pageCopy.searchPlaceholder ?? "Search bookings, customers...";
  const isFilterHidden = hideFilterButton ?? pageCopy.hideFilterButton;
  const isSearchHidden = hideSearch ?? pageCopy.hideSearch;
  const isPrimaryActionHidden = hidePrimaryAction ?? false;

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
        {children ? children : (
          <>
            <div className={styles.heading}>
              <h1>{visibleTitle}</h1>
              <p>{visibleSubtitle}</p>
            </div>

            <div className={styles.tools}>
              {!isFilterHidden && (
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
              )}

              {!isSearchHidden && (
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
                  <input 
                    type="search" 
                    placeholder={searchPlaceholder} 
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                  />
                </label>
              )}

              {visibleSecondaryAction ? (
                <button
                  type={visibleSecondaryAction.type || "button"}
                  form={visibleSecondaryAction.form}
                  className={styles.secondaryActionButton}
                  onClick={onSecondaryAction}
                >
                  {visibleSecondaryAction.iconSrc && (
                    <Image
                      src={visibleSecondaryAction.iconSrc}
                      alt=""
                      width={20}
                      height={20}
                      aria-hidden
                      style={visibleSecondaryAction.iconRotation ? { transform: `rotate(${visibleSecondaryAction.iconRotation}deg)` } : undefined}
                    />
                  )}
                  {visibleSecondaryAction.label}
                </button>
              ) : null}

              {!isPrimaryActionHidden && visiblePrimaryAction ? (
                <button
                  type={visiblePrimaryAction.type || "button"}
                  form={visiblePrimaryAction.form}
                  className={styles.primaryActionButton}
                  onClick={onPrimaryAction}
                >
                  {visiblePrimaryAction.label}
                  {!visiblePrimaryAction.hideIcon && (
                    <Image
                      src={visiblePrimaryAction.iconSrc || "/images/dashboard/navbar/add-circle.svg"}
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden
                      style={visiblePrimaryAction.iconRotation ? { transform: `rotate(${visiblePrimaryAction.iconRotation}deg)` } : undefined}
                    />
                  )}
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
