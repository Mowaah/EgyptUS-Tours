"use client";

import { useState, useEffect } from "react";
import { CategoryTabs } from "@/components/shared";
import styles from "./DetailTabNav.module.scss";

interface DetailTabNavProps {
  tabs: { id: string; label: string }[];
}

export default function DetailTabNav({ tabs }: DetailTabNavProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );
    
    tabs.forEach((tab) => {
      const el = document.getElementById(tab.id);
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, [tabs]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // sticky nav height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className={styles.tabNav}>
      <div className={styles.inner}>
        <CategoryTabs
          tabs={tabs.map(tab => tab.label)}
          active={activeIndex !== -1 ? activeIndex : 0}
          onTabChange={(_: string, idx: number) => {
            const id = tabs[idx].id;
            setActiveTab(id);
            scrollTo(id);
          }}
          wrap
        />
      </div>
    </div>
  );
}
