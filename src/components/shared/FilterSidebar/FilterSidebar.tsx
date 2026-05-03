"use client";
import React, { useState, useEffect, useLayoutEffect, ReactNode } from "react";
import Image from "next/image";
import { useScrollLock } from "@/hooks/useScrollLock";
import Button from "@/components/shared/Button/Button";
import styles from "./FilterSidebar.module.scss";

interface FilterSidebarProps {
  children: ReactNode;
  activeCount: number;
  totalResults: number;
  resultsLabel?: string;
  onReset?: () => void;
  id?: string;
}

export default function FilterSidebar({
  children,
  activeCount,
  totalResults,
  resultsLabel = "items",
  onReset,
  id = "filter-sidebar",
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle responsive state
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      setIsDesktop(mq.matches);
      if (mq.matches) setIsOpen(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Lock scroll on mobile when open
  useScrollLock(isOpen);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className={styles.mobileToggleBar}>
        <button
          className={styles.toggleBtn}
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls={id}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h2M9 6h12M3 12h2M6 12h12M3 18h2M9 18h12" />
            <circle cx="7" cy="6" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="17" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="7" cy="18" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className={styles.badge}>{activeCount}</span>
          )}
        </button>
        <p className={styles.resultsCount}>
          Showing <strong>{totalResults}</strong> {resultsLabel}
        </p>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <aside
        id={id}
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <h3 className={styles.mobileTitle}>Filters</h3>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className={styles.content}>
          {children}
        </div>

        {/* Mobile Footer */}
        <div className={styles.mobileFooter}>
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            onClick={() => setIsOpen(false)}
          >
            Show results
          </Button>
          {onReset && activeCount > 0 && (
            <button className={styles.resetBtn} onClick={onReset}>
              Reset all
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
