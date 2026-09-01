"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import NotificationDropdown from "./NotificationDropdown/NotificationDropdown";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import pageCopyByPath, { type BreadcrumbSegment } from "./navbarPageCopy";
import styles from "./DashboardNavbar.module.scss";


interface ActionConfig {
  label: string;
  form?: string;
  type?: "button" | "submit" | "reset";
  iconSrc?: string;
  iconRotation?: number;
  hideIcon?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  loading?: boolean;
}

interface DashboardNavbarProps {
  title?: string;
  subtitle?: string;
  breadcrumbTrail?: BreadcrumbSegment[];
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  tertiaryAction?: ActionConfig;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  children?: React.ReactNode;
  hideFilterButton?: boolean;
  hideSearch?: boolean;
  hidePrimaryAction?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
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

const getActionClass = (config: ActionConfig, defaultClass: string) => {
  if (config.variant === "primary") return styles.primaryActionButton;
  if (config.variant === "secondary") return styles.secondaryActionButton;
  if (config.variant === "tertiary") return styles.tertiaryActionButton;
  return defaultClass;
};

export default function DashboardNavbar({
  title,
  subtitle,
  breadcrumbTrail,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  children,
  hideFilterButton,
  hideSearch,
  hidePrimaryAction,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
}: DashboardNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

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
  const visibleTertiaryAction = tertiaryAction ?? (pageCopy as any).tertiaryAction;
  const searchPlaceholderStr =
    searchPlaceholder ?? pageCopy.searchPlaceholder ?? "Search bookings, customers...";
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

        <NotificationDropdown />
      </div>

      <div className={styles.bottomRow}>
        {children ? children : (
          <>
            <div className={styles.heading}>
              <h1>{visibleTitle}</h1>
              <p>{visibleSubtitle}</p>
            </div>

            <div className={styles.tools}>
              {(pageCopy as any).showStatusFilter ? (
                <StatusFilterDropdown />
              ) : (
                !isFilterHidden && (
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
                )
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
                    placeholder={searchPlaceholderStr}
                    value={searchQuery ?? searchParams.get("search") ?? ""}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </label>
              )}

              {visibleTertiaryAction ? (
                <button
                  type={visibleTertiaryAction.type || "button"}
                  form={visibleTertiaryAction.form}
                  className={getActionClass(visibleTertiaryAction, styles.tertiaryActionButton)}
                  onClick={onTertiaryAction}
                  disabled={visibleTertiaryAction.disabled || visibleTertiaryAction.loading}
                >
                  {visibleTertiaryAction.loading && (
                    <span className={styles.loadingSpinner} aria-hidden="true" />
                  )}
                  {visibleTertiaryAction.iconSrc && !visibleTertiaryAction.loading && !visibleTertiaryAction.hideIcon && (
                    <Image
                      src={visibleTertiaryAction.iconSrc}
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden
                      className={styles.actionIcon}
                      style={visibleTertiaryAction.iconRotation ? { transform: `rotate(${visibleTertiaryAction.iconRotation}deg)` } : undefined}
                    />
                  )}
                  {!visibleTertiaryAction.loading && visibleTertiaryAction.label}
                </button>
              ) : null}

              {visibleSecondaryAction ? (
                <button
                  type={visibleSecondaryAction.type || "button"}
                  form={visibleSecondaryAction.form}
                  className={getActionClass(visibleSecondaryAction, styles.secondaryActionButton)}
                  onClick={onSecondaryAction}
                  disabled={visibleSecondaryAction.disabled || visibleSecondaryAction.loading}
                >
                  {visibleSecondaryAction.loading && (
                    <span className={styles.loadingSpinner} aria-hidden="true" />
                  )}
                  {visibleSecondaryAction.iconSrc && !visibleSecondaryAction.loading && !visibleSecondaryAction.hideIcon && (
                    <Image
                      src={visibleSecondaryAction.iconSrc}
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden
                      className={styles.actionIcon}
                      style={visibleSecondaryAction.iconRotation ? { transform: `rotate(${visibleSecondaryAction.iconRotation}deg)` } : undefined}
                    />
                  )}
                  {!visibleSecondaryAction.loading && visibleSecondaryAction.label}
                </button>
              ) : null}

              {!isPrimaryActionHidden && visiblePrimaryAction ? (
                <button
                  type={visiblePrimaryAction.type || "button"}
                  form={visiblePrimaryAction.form}
                  className={getActionClass(visiblePrimaryAction, styles.primaryActionButton)}
                  onClick={onPrimaryAction}
                  disabled={visiblePrimaryAction.disabled || visiblePrimaryAction.loading}
                >
                  {visiblePrimaryAction.loading && (
                    <span className={styles.loadingSpinner} aria-hidden="true" />
                  )}
                  {!visiblePrimaryAction.loading && visiblePrimaryAction.label}
                  {!visiblePrimaryAction.loading && !visiblePrimaryAction.hideIcon && (
                    <Image
                      src={visiblePrimaryAction.iconSrc || "/images/dashboard/navbar/add-circle.svg"}
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden
                      className={styles.actionIcon}
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

function StatusFilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "All";
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedStatus === "All") {
      params.delete("status");
    } else {
      params.set("status", selectedStatus);
    }
    router.replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const handleClean = () => {
    setSelectedStatus("All");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    router.replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div ref={filterRef} className={styles.filterDropdownContainer}>
      <button 
        className={`${styles.filterButton} ${isOpen ? styles.active : ""}`} 
        type="button" 
        aria-label="Filter dashboard results" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src="/images/dashboard/navbar/filter.svg" alt="" width={24} height={24} className={styles.actionIcon} aria-hidden />
      </button>

      {isOpen && (
        <div className={styles.filterDropdown}>
          <div className={styles.filterHeader}>
            <div className={styles.filterHeaderIcon}>
              <Image src="/images/dashboard/navbar/filter.svg" alt="" width={20} height={20} />
            </div>
            <div className={styles.filterHeaderTitle}>Filters</div>
          </div>

          <div className={styles.filterSection}>
            <span className={styles.filterSectionTitle}>Status</span>
            <div className={styles.filterPills}>
              {["Published", "Unpublished"].map((status) => (
                <div
                  key={status}
                  className={`${styles.filterPill} ${selectedStatus === status ? styles.active : ""}`}
                  onClick={() => setSelectedStatus(selectedStatus === status ? "All" : status)}
                >
                  <div className={styles.filterPillRadio}>
                    {selectedStatus === status && (
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 7.5L6.5 10L11 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {status}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.filterFooter}>
            <button type="button" className={styles.btnClean} onClick={handleClean}>Clean</button>
            <button type="button" className={styles.btnApply} onClick={handleApply}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
