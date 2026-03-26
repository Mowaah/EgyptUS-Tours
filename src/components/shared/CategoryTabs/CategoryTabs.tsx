"use client";

import { useState } from "react";
import styles from "./CategoryTabs.module.scss";

interface CategoryTabsProps {
  tabs: string[];
  defaultActive?: number;
  onTabChange?: (tab: string, index: number) => void;
  /** When true, splits tabs into separate pill rows instead of scrolling */
  wrap?: boolean;
  /** How many tabs per row when wrap=true (default: 8) */
  wrapAfter?: number;
}

export default function CategoryTabs({
  tabs,
  defaultActive = 0,
  onTabChange,
  wrap = false,
  wrapAfter = 8,
}: CategoryTabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActive);

  const handleClick = (tab: string, index: number) => {
    setActiveIndex(index);
    onTabChange?.(tab, index);
  };

  if (wrap) {
    // Split into row chunks, each rendered in its own pill wrapper
    const rows: string[][] = [];
    for (let i = 0; i < tabs.length; i += wrapAfter) {
      rows.push(tabs.slice(i, i + wrapAfter));
    }

    let runningIndex = 0;

    return (
      <div className={styles.wrapRows}>
        {rows.map((row, rowIdx) => {
          const rowStart = runningIndex;
          runningIndex += row.length;
          return (
            <div key={rowIdx} className={styles.wrapper}>
              <div className={styles.tabs}>
                {row.map((tab, i) => {
                  const absIdx = rowStart + i;
                  return (
                    <button
                      key={tab}
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

  // Default: single scrollable pill row (homepage)
  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={tab}
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
