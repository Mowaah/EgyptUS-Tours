"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import styles from "./ProfileHeader.module.scss";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export function ProfileHeader() {
  const router = useRouter();
  const { adminUser, logoutAdminTokens } = useAdminAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const formattedLastLogin = adminUser?.last_login
    ? new Date(adminUser.last_login).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    : "Never";

  return (
    <div className={styles.headerContainer}>
      <div className={styles.content}>

        {/* User Info Left Side */}
        <div className={styles.userInfo}>
          <div className={styles.avatarWrapper}>
            {adminUser?.profile_picture ? (
              <img src={adminUser.profile_picture} alt="Avatar" className={styles.avatarImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <div className={styles.avatarPlaceholder} />
            )}
          </div>

          <div className={styles.textGroup}>
            <div className={styles.titleRow}>
              <h1 className={styles.name}>{adminUser?.full_name || "Loading..."}</h1>
              { (adminUser?.role_label || adminUser?.role) && <span className={styles.badgeSuperAdmin}>{adminUser?.role_label || adminUser?.role}</span> }
              {adminUser?.is_active && <span className={styles.badgeActive}>Active</span>}
            </div>

            <div className={styles.subtitleRow}>
              <span className={styles.metaText}>{adminUser?.email}</span>
              <span className={styles.metaDot}>•</span>
              <span className={styles.metaText}>Last log in: {formattedLastLogin}</span>
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
              <path d="M17.4395 14.62L19.9995 12.06L17.4395 9.5" stroke="#B91C1C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.75977 12.0601H19.9298" stroke="#B91C1C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11.76 20C7.34 20 3.76 17 3.76 12C3.76 7 7.34 4 11.76 4" stroke="#B91C1C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
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
          logoutAdminTokens();
          router.push("/dashboard/login");
        }}
      />
    </div>
  );
}
