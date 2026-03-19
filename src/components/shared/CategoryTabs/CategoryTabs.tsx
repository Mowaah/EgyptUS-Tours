"use client";

import { useState } from "react";
import styles from "./CategoryTabs.module.scss";

interface CategoryTabsProps {
  tabs: string[];
  defaultActive?: number;
  onTabChange?: (tab: string, index: number) => void;
}

export default function CategoryTabs({
  tabs,
  defaultActive = 0,
  onTabChange,
}: CategoryTabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActive);

  const handleClick = (tab: string, index: number) => {
    setActiveIndex(index);
    onTabChange?.(tab, index);
  };

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
