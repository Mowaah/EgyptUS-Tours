"use client";

import { useState, useEffect } from "react";
import { CategoryTabs } from "@/components/shared";
import styles from "./TripTabNav.module.scss";

export const TAB_IDS = [
  "overview",
  "included",
  "excluded",
  "traveler-photos",
  "prices-accommodation",
  "itinerary",
  "pricing",
  "vip-experiences",
  "reviews",
  "more-adventures",
] as const;

export const TAB_LABELS: Record<(typeof TAB_IDS)[number], string> = {
  "overview": "Overview",
  "included": "What's Included",
  "excluded": "What's Not Included",
  "traveler-photos": "Taken by Travelers",
  "prices-accommodation": "Prices & Accommodation",
  "itinerary": "Day-by-Day Itinerary",
  "pricing": "Pricing",
  "vip-experiences": "VIP Experiences",
  "reviews": "Traveler Reviews",
  "more-adventures": "More Inspiring Adventures",
};

export default function TripTabNav() {
  const [activeTab, setActiveTab] = useState<string>(TAB_IDS[0]);

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
    TAB_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // sticky nav height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const activeIndex = TAB_IDS.indexOf(activeTab as any);

  return (
    <div className={styles.tabNav}>
      <div className={styles.inner}>
        <CategoryTabs
          tabs={TAB_IDS.map(id => TAB_LABELS[id as keyof typeof TAB_LABELS])}
          active={activeIndex !== -1 ? activeIndex : 0}
          onTabChange={(_: string, idx: number) => {
            const id = TAB_IDS[idx];
            setActiveTab(id);
            scrollTo(id);
          }}
        />
      </div>
    </div>
  );
}
