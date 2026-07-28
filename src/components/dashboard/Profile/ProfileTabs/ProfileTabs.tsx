"use client";

import styles from "./ProfileTabs.module.scss";

interface ProfileTabsProps {
  activeTab: "Personal Information" | "Security";
  onChangeTab: (tab: "Personal Information" | "Security") => void;
}

export function ProfileTabs({ activeTab, onChangeTab }: ProfileTabsProps) {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsWrapper}>
        
        {/* Personal Information Tab */}
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "Personal Information" ? styles.active : ""}`}
          onClick={() => onChangeTab("Personal Information")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke={activeTab === "Personal Information" ? "#2971E6" : "#A3A3A3"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke={activeTab === "Personal Information" ? "#2971E6" : "#A3A3A3"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.tabText}>Personal Information</span>
        </button>

        {/* Security Tab */}
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "Security" ? styles.active : ""}`}
          onClick={() => onChangeTab("Security")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke={activeTab === "Security" ? "#2971E6" : "#A3A3A3"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12C12.8284 12 13.5 11.3284 13.5 10.5C13.5 9.67157 12.8284 9 12 9C11.1716 9 10.5 9.67157 10.5 10.5C10.5 11.3284 11.1716 12 12 12Z" stroke={activeTab === "Security" ? "#2971E6" : "#A3A3A3"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12V15" stroke={activeTab === "Security" ? "#2971E6" : "#A3A3A3"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.tabText}>Security</span>
        </button>

      </div>
    </div>
  );
}
