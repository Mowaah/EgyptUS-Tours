"use client";

import Image from "next/image";
import styles from "./ProfileSidebar.module.scss";

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string | null;
  bookingsCount: number;
  requestsCount: number;
}

export type TabType = "favorites" | "bookings" | "requests";

/** Active tab: tint glyph with design-token primary via mask (exact #2971E6). */
function NavGlyph({ src, active }: { src: string; active: boolean }) {
  if (active) {
    return (
      <span
        className={styles.navIconPrimaryMask}
        style={{
          WebkitMaskImage: `url("${src}")`,
          maskImage: `url("${src}")`,
        }}
        aria-hidden="true"
      />
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={24}
      height={24}
      className={styles.navIcon}
      aria-hidden="true"
    />
  );
}

export interface ProfileSidebarProps {
  user: UserProfile;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
}

export default function ProfileSidebar({
  user,
  activeTab,
  onTabChange,
  className = "",
}: ProfileSidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${className}`}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatar}>
                <Image
                  src="/images/profile/profile-orange.svg"
                  alt=""
                  width={45}
                  height={45}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          <h3 className={styles.userName}>{user.name}</h3>
        </div>

        <div className={styles.divider} />

        <div className={styles.emailSection}>
          <div className={styles.emailBox}>
            <span className={styles.emailLabel}>Email</span>
            <span className={styles.emailValue}>{user.email}</span>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <div className={styles.statIconInner}>
                <Image
                  src="/images/profile/bookings.svg"
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statLabel}>Bookings</span>
              <span className={styles.statValue}>{user.bookingsCount}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <div className={styles.statIconInner}>
                <Image
                  src="/images/profile/requests.svg"
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statLabel}>Requests</span>
              <span className={styles.statValue}>{user.requestsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className={styles.navCard}>
        <button
          className={`${styles.navItem} ${activeTab === "favorites" ? styles.navItemActive : ""}`}
          onClick={() => onTabChange("favorites")}
        >
          <NavGlyph src="/images/heart-outline.svg" active={activeTab === "favorites"} />
          <span>My Favorites</span>
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "bookings" ? styles.navItemActive : ""}`}
          onClick={() => onTabChange("bookings")}
        >
          <NavGlyph src="/images/message-2.svg" active={activeTab === "bookings"} />
          <span>My Bookings</span>
        </button>
        <button
          className={`${styles.navItem} ${activeTab === "requests" ? styles.navItemActive : ""}`}
          onClick={() => onTabChange("requests")}
        >
          <NavGlyph src="/images/archive-book.svg" active={activeTab === "requests"} />
          <span>My Requests</span>
        </button>
      </div>
    </aside>
  );
}
