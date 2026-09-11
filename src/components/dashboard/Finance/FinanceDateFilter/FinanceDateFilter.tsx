"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CustomDatePicker, CheckboxIndicator } from "@/components/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import styles from "./FinanceDateFilter.module.scss";

type QuickRange = "today" | "this_week" | "this_month";

function toPickerValue(isoStr: string): string {
  if (!isoStr) return "";
  if (isoStr.includes("/")) return isoStr;
  const parts = isoStr.split("-");
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${mm}/${dd}/${yyyy}`;
  }
  return isoStr;
}

function toIsoDate(pickerStr: string): string {
  if (!pickerStr) return "";
  if (pickerStr.includes("-")) return pickerStr;
  const parts = pickerStr.split("/");
  if (parts.length === 3) {
    const [mm, dd, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return pickerStr;
}

function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const iso = toIsoDate(dateStr);
    const date = new Date(iso + "T00:00:00");
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function FinanceDateFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRange = searchParams.get("range");
  const currentDateFrom = searchParams.get("date_from") || "";
  const currentDateTo = searchParams.get("date_to") || "";

  const hasActiveFilter = Boolean(currentRange || currentDateFrom || currentDateTo);

  const initialQuickRange: QuickRange | null =
    currentRange === "today" || currentRange === "this_week" || currentRange === "this_month"
      ? (currentRange as QuickRange)
      : null;

  // Local draft state for the popover
  const [selectedQuickRange, setSelectedQuickRange] = useState<QuickRange | null>(initialQuickRange);
  const [startDate, setStartDate] = useState(currentDateFrom);
  const [endDate, setEndDate] = useState(currentDateTo);

  // Sync draft state whenever search params change or popover opens
  useEffect(() => {
    const r =
      currentRange === "today" || currentRange === "this_week" || currentRange === "this_month"
        ? (currentRange as QuickRange)
        : null;
    setSelectedQuickRange(r);
    setStartDate(currentDateFrom);
    setEndDate(currentDateTo);
  }, [currentRange, currentDateFrom, currentDateTo, isOpen]);

  // Click outside listener (ignores clicks within CustomDatePicker portal dropdown)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (containerRef.current && containerRef.current.contains(target)) {
        return;
      }

      if (
        target.closest &&
        (target.closest(`.${styles.datePickerPortal}`) ||
          target.closest('[class*="CustomDatePicker_dropdown"]') ||
          target.closest('[class*="dropdown"]'))
      ) {
        return;
      }

      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectQuickRange = (range: QuickRange) => {
    if (selectedQuickRange === range) {
      setSelectedQuickRange(null);
    } else {
      setSelectedQuickRange(range);
      setStartDate("");
      setEndDate("");
    }
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val) {
      setSelectedQuickRange(null);
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (val) {
      setSelectedQuickRange(null);
    }
  };

  const handleClean = () => {
    setSelectedQuickRange(null);
    setStartDate("");
    setEndDate("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("range");
    params.delete("date_from");
    params.delete("date_to");

    const newQuery = params.toString();
    router.replace(newQuery ? `${pathname}?${newQuery}` : pathname);
    setIsOpen(false);
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedQuickRange) {
      params.set("range", selectedQuickRange);
      params.delete("date_from");
      params.delete("date_to");
    } else if (startDate || endDate) {
      params.set("range", "custom");
      if (startDate) {
        params.set("date_from", startDate);
      } else {
        params.delete("date_from");
      }
      if (endDate) {
        params.set("date_to", endDate);
      } else {
        params.delete("date_to");
      }
    } else {
      params.delete("range");
      params.delete("date_from");
      params.delete("date_to");
    }

    const newQuery = params.toString();
    router.replace(newQuery ? `${pathname}?${newQuery}` : pathname);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        type="button"
        className={`${styles.filterButton} ${isOpen ? styles.active : ""} ${
          hasActiveFilter ? styles.hasFilter : ""
        }`}
        aria-label="Filter finance results by date"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Image
          src="/images/dashboard/navbar/filter.svg"
          alt=""
          width={24}
          height={24}
          className={styles.actionIcon}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className={styles.filterPopover} role="dialog" aria-label="Finance date filter">
          {/* Header */}
          <div className={styles.popoverHeader}>
            <div className={styles.headerIconBadge}>
              <Image
                src="/images/dashboard/navbar/filter.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden
              />
            </div>
            <span className={styles.headerTitle}>Filters</span>
          </div>

          {/* Body */}
          <div className={styles.popoverBody}>
            {/* Section 1: Filter by Date */}
            <div className={styles.section}>
              <span className={styles.sectionTitle}>Filter by Date</span>
              <div className={styles.quickFiltersRow}>
                {/* Today */}
                <button
                  type="button"
                  className={`${styles.quickFilterPill} ${
                    selectedQuickRange === "today" ? styles.quickFilterPillActive : ""
                  }`}
                  onClick={() => handleSelectQuickRange("today")}
                >
                  <CheckboxIndicator
                    variant="radio"
                    size="lg"
                    selected={selectedQuickRange === "today"}
                    aria-hidden
                  />
                  <span className={styles.quickFilterText}>Today</span>
                </button>

                {/* This Week */}
                <button
                  type="button"
                  className={`${styles.quickFilterPill} ${
                    selectedQuickRange === "this_week" ? styles.quickFilterPillActive : ""
                  }`}
                  onClick={() => handleSelectQuickRange("this_week")}
                >
                  <CheckboxIndicator
                    variant="radio"
                    size="lg"
                    selected={selectedQuickRange === "this_week"}
                    aria-hidden
                  />
                  <span className={styles.quickFilterText}>This Week</span>
                </button>

                {/* This Month */}
                <button
                  type="button"
                  className={`${styles.quickFilterPill} ${
                    selectedQuickRange === "this_month" ? styles.quickFilterPillActive : ""
                  }`}
                  onClick={() => handleSelectQuickRange("this_month")}
                >
                  <CheckboxIndicator
                    variant="radio"
                    size="lg"
                    selected={selectedQuickRange === "this_month"}
                    aria-hidden
                  />
                  <span className={styles.quickFilterText}>This Month</span>
                </button>
              </div>
            </div>

            {/* Section 2: Custom Range */}
            <div className={styles.section}>
              <span className={styles.sectionTitle}>Custom Range</span>
              <div className={styles.customRangeRow}>
                {/* Start Date */}
                <CustomDatePicker
                  variant="custom"
                  allowPastDates={true}
                  value={toPickerValue(startDate)}
                  onChange={(val) => handleStartDateChange(toIsoDate(val))}
                  dropdownClassName={styles.datePickerPortal}
                  renderTrigger={(isPickerOpen, setIsPickerOpen) => (
                    <div
                      className={styles.datePickerTrigger}
                      onClick={() => setIsPickerOpen(!isPickerOpen)}
                    >
                      <DashboardField
                        placeholder="Start date"
                        value={startDate ? formatDateLabel(startDate) : ""}
                        readOnly
                        className={isPickerOpen ? styles.inputActive : undefined}
                        endAdornment={
                          <Image
                            src="/images/calendar3.svg"
                            alt=""
                            width={20}
                            height={20}
                            aria-hidden
                          />
                        }
                      />
                    </div>
                  )}
                />

                {/* End Date */}
                <CustomDatePicker
                  variant="custom"
                  allowPastDates={true}
                  value={toPickerValue(endDate)}
                  onChange={(val) => handleEndDateChange(toIsoDate(val))}
                  dropdownClassName={styles.datePickerPortal}
                  renderTrigger={(isPickerOpen, setIsPickerOpen) => (
                    <div
                      className={styles.datePickerTrigger}
                      onClick={() => setIsPickerOpen(!isPickerOpen)}
                    >
                      <DashboardField
                        placeholder="End date"
                        value={endDate ? formatDateLabel(endDate) : ""}
                        readOnly
                        className={isPickerOpen ? styles.inputActive : undefined}
                        endAdornment={
                          <Image
                            src="/images/calendar3.svg"
                            alt=""
                            width={20}
                            height={20}
                            aria-hidden
                          />
                        }
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.popoverFooter}>
            <button type="button" className={styles.btnClean} onClick={handleClean}>
              Clean
            </button>
            <button type="button" className={styles.btnApply} onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
