"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DashboardTabs.module.scss";

export interface TabConfig<T extends string = string> {
  id: T;
  label: string;
  iconSrc?: string;
  href?: string;
}

interface DashboardTabsProps<T extends string = string> {
  tabs: TabConfig<T>[];
  activeTab?: T;
  onTabChange?: (tabId: T) => void;
  ariaLabel?: string;
}

export default function DashboardTabs<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel = "Dashboard tabs",
}: DashboardTabsProps<T>) {
  const pathname = usePathname();
  const isLinkedMode = tabs.some((tab) => tab.href);

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabs} role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab) => {
          const active = isLinkedMode
            ? pathname?.split("/").at(-1) === tab.id
            : activeTab === tab.id;

          const className = `${styles.tab} ${active ? styles.tabActive : ""}`;

          const content = (
            <div className={styles.tabContent}>
              {tab.iconSrc && (
                <span
                  className={styles.tabIcon}
                  style={{
                    maskImage: `url(${tab.iconSrc})`,
                    WebkitMaskImage: `url(${tab.iconSrc})`,
                  }}
                  aria-hidden
                />
              )}
              <span>{tab.label}</span>
            </div>
          );

          if (tab.href) {
            return (
              <Link
                key={tab.id}
                href={tab.href}
                role="tab"
                aria-selected={active}
                className={className}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={active}
              className={className}
              onClick={() => onTabChange?.(tab.id)}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
