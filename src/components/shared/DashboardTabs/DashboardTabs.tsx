import Image from "next/image";
import styles from "./DashboardTabs.module.scss";

export interface TabConfig<T extends string = string> {
  id: T;
  label: string;
  iconSrc?: string;
}

interface DashboardTabsProps<T extends string = string> {
  tabs: TabConfig<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  ariaLabel?: string;
}

export default function DashboardTabs<T extends string = string>({ 
  tabs, 
  activeTab, 
  onTabChange,
  ariaLabel = "Dashboard tabs"
}: DashboardTabsProps<T>) {
  return (
    <div className={styles.tabCard}>
      <div className={styles.tabs} role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className={styles.tabContent}>
              {tab.iconSrc && (
                <span 
                  className={styles.tabIcon}
                  style={{
                    maskImage: `url(${tab.iconSrc})`,
                    WebkitMaskImage: `url(${tab.iconSrc})`
                  }}
                  aria-hidden 
                />
              )}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
