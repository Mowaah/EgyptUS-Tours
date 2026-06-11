"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardConfirmationModal from "@/components/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import styles from "./ProfileHeader.module.scss";

export function ProfileHeader() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  return (
    <div className={styles.headerContainer}>
      <div className={styles.content}>
        
        {/* User Info Left Side */}
        <div className={styles.userInfo}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarPlaceholder} />
          </div>

          <div className={styles.textGroup}>
            <div className={styles.titleRow}>
              <h1 className={styles.name}>Adam Saed Bakr</h1>
              <span className={styles.badgeSuperAdmin}>Super Admin</span>
              <span className={styles.badgeActive}>Active</span>
            </div>

            <div className={styles.subtitleRow}>
              <span className={styles.metaText}>IP : 124.33.12.4</span>
              <span className={styles.metaDot}>•</span>
              <span className={styles.metaText}>Last log in Today, 9:01 AM</span>
            </div>
          </div>
        </div>

        {/* Action Button Right Side */}
        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.signOutButton}
            onClick={() => setIsLogoutModalOpen(true)}
          >
            <span>Sign Out</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.4395 14.62L19.9995 12.06L17.4395 9.5" stroke="#B91C1C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.75977 12.0601H19.9298" stroke="#B91C1C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.76 20C7.34 20 3.76 17 3.76 12C3.76 7 7.34 4 11.76 4" stroke="#B91C1C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>

      <DashboardConfirmationModal
        open={isLogoutModalOpen}
        variant="logout"
        title="Logout?"
        message="Your account will remain safe and secure"
        confirmLabel="Logout"
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          router.push("/dashboard/login");
        }}
      />
    </div>
  );
}
