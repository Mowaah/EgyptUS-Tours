"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { ProfileHeader } from "@/components/dashboard/Profile/ProfileHeader";
import { ProfileTabs } from "@/components/dashboard/Profile/ProfileTabs";
import { PersonalInfoTab } from "@/components/dashboard/Profile/PersonalInfoTab";
import { SecurityTab } from "@/components/dashboard/Profile/SecurityTab";
import styles from "./page.module.scss";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"Personal Information" | "Security">("Personal Information");

  return (
    <>
            
        {/* We use the DashboardNavbar but pass custom children for the Profile Header block */}
        <div className={styles.navbarWrapper}>
          <DashboardNavbar>
            <ProfileHeader />
          </DashboardNavbar>
        </div>

        <div className={styles.profileContainer}>
          <ProfileTabs activeTab={activeTab} onChangeTab={setActiveTab} />
          <div className={styles.tabContentWrapper}>
            {activeTab === "Personal Information" && <PersonalInfoTab />}
            {activeTab === "Security" && <SecurityTab />}
          </div>
        </div>
      
    </>
  );
}
