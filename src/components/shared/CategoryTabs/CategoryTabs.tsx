"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import styles from "./CategoryTabs.module.scss";

interface CategoryTabsProps {
  tabs: string[];
  defaultActive?: number;
  active?: number;
  onTabChange?: (tab: string, index: number) => void;
  wrap?: boolean;
}

export default function CategoryTabs({
  tabs,
  defaultActive = 0,
  active,
  onTabChange,
  wrap = false,
}: CategoryTabsProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActive);
  const activeIndex = active !== undefined ? active : internalActiveIndex;
  const [measuredRows, setMeasuredRows] = useState<string[][]>([]);
  const measureRef = useRef<HTMLDivElement>(null);

  const handleClick = (tab: string, index: number) => {
    if (active === undefined) {
      setInternalActiveIndex(index);
    }
    onTabChange?.(tab, index);
  };

  const measureTabs = () => {
    if (!wrap || !measureRef.current) return;
    const container = measureRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    const rows: string[][] = [];
    let currentY = -1;
    let currentRow: string[] = [];

    children.forEach((child, i) => {
      const top = child.offsetTop;
      if (currentY === -1 || top > currentY + 10) { // +10 buffer for sub-pixel safety
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [tabs[i]];
        currentY = top;
      } else {
        currentRow.push(tabs[i]);
      }
    });

    if (currentRow.length > 0) rows.push(currentRow);
    setMeasuredRows(rows);
  };

  useLayoutEffect(() => {
    measureTabs();
  }, [tabs, wrap]);

  // Re-measure on window resize to ensure fluid wrapping exactly like CSS
  useEffect(() => {
    if (!wrap) return;
    const handleResize = () => measureTabs();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [tabs, wrap]);

  if (wrap) {
    if (measuredRows.length === 0) {
      // Pass 1: Invisible flex-wrap render to legally calculate browser wrapping
      return (
        <div 
          className={styles.wrapEnabled} 
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <div className={styles.tabsWrapped} ref={measureRef}>
            {tabs.map((tab, index) => (
              <button key={`measure-${index}`} className={styles.tab}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Pass 2: Accurately render chunked rows with the desired distinct pill backgrounds
    let runningIndex = 0;
    return (
      <div className={styles.wrapRows}>
        {measuredRows.map((row, rowIdx) => {
          const rowStart = runningIndex;
          runningIndex += row.length;
          return (
            <div key={rowIdx} className={styles.wrapper}>
              <div className={styles.tabs}>
                {row.map((tab, i) => {
                  const absIdx = rowStart + i;
                  return (
                    <button
                      key={`${tab}-${absIdx}`}
                      className={`${styles.tab} ${absIdx === activeIndex ? styles.active : ""}`}
                      onClick={() => handleClick(tab, absIdx)}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default: single scrollable pill row
  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={`${tab}-${index}`}
            className={`${styles.tab} ${index === activeIndex ? styles.active : ""}`}
            onClick={() => handleClick(tab, index)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
