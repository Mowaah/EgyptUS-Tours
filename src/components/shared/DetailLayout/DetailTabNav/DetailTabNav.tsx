"use client";

import { useState, useEffect, useRef } from "react";
import { CategoryTabs } from "@/components/shared";
import styles from "./DetailTabNav.module.scss";

interface DetailTabNavProps {
  tabs: { id: string; label: string }[];
}

export default function DetailTabNav({ tabs }: DetailTabNavProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "");
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return; // Ignore intersections during manual scroll
        
        // We only care about entries that are currently intersecting
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // If multiple trigger, pick the last one (usually furthest down)
          setActiveTab(visibleEntries[visibleEntries.length - 1].target.id);
        }
      },
      { rootMargin: "-190px 0px -50% 0px", threshold: 0 }
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
      isClickScrolling.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      
      // Re-enable observer after smooth scroll completes (approx 800ms)
      scrollTimeout.current = setTimeout(() => {
        isClickScrolling.current = false;
      }, 800);

      const isDesktop = window.innerWidth >= 1150;
      const navHeight = isDesktop ? 110 : 72; // Desktop navbar is 110px tall and sticky
      const tabNavHeight = 60; 
      const offset = navHeight + tabNavHeight + 20;
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
            const targetTab = tabs[idx];
            if (targetTab) {
              const id = targetTab.id;
              setActiveTab(id);
              scrollTo(id);
            }
          }}
          wrap
          disableAnimation
        />
      </div>
    </div>
  );
}
