"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CategoryTabs } from "@/components/shared";
import styles from "./DetailTabNav.module.scss";

interface DetailTabNavProps {
  tabs: { id: string; label: string }[];
  /** When true, navbar scrolls away on desktop — tab nav sticks to viewport top. */
  staticNavbarOnDesktop?: boolean;
}

export default function DetailTabNav({ tabs, staticNavbarOnDesktop = false }: DetailTabNavProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "");
  const [tabNavHeight, setTabNavHeight] = useState(0);
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const tabNavRef = useRef<HTMLDivElement>(null);

  const measureTabNav = useCallback(() => {
    if (tabNavRef.current) {
      setTabNavHeight(tabNavRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    measureTabNav();
    window.addEventListener("resize", measureTabNav, { passive: true });
    return () => window.removeEventListener("resize", measureTabNav);
  }, [measureTabNav, tabs]);

  useEffect(() => {
    const rootMarginTop = (() => {
      const isDesktop = window.innerWidth >= 1150;
      const navHeight = isDesktop ? (staticNavbarOnDesktop ? 0 : 110) : 72;
      const tabHeight = tabNavHeight || (isDesktop ? 130 : 72);
      return `-${navHeight + tabHeight + 24}px 0px -50% 0px`;
    })();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveTab(visibleEntries[visibleEntries.length - 1].target.id);
        }
      },
      { rootMargin: rootMarginTop, threshold: 0 }
    );

    tabs.forEach((tab) => {
      const el = document.getElementById(tab.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tabs, staticNavbarOnDesktop, tabNavHeight]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      isClickScrolling.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        isClickScrolling.current = false;
      }, 800);

      const isDesktop = window.innerWidth >= 1150;
      const navHeight = isDesktop ? (staticNavbarOnDesktop ? 0 : 110) : 72;
      const measuredTabHeight = tabNavHeight || tabNavRef.current?.offsetHeight || (isDesktop ? 130 : 72);
      const offset = navHeight + measuredTabHeight + 24;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div
      ref={tabNavRef}
      className={`${styles.tabNav}${staticNavbarOnDesktop ? ` ${styles.staticNavbarOnDesktop}` : ""}`}
    >
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
          disableAnimation
        />
      </div>
    </div>
  );
}
