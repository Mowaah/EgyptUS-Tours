"use client";

import { useState } from "react";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import SEOConfigurationForm from "./SEOConfigurationForm";
import styles from "./SEOConfiguration.module.scss";

const seoTabs = [
  { id: "home", label: "Home", iconSrc: "/images/dashboard/seo/home.svg" },
  { id: "trips", label: "Trips", iconSrc: "/images/dashboard/seo/trips.svg" },
  { id: "hotels", label: "Hotels", iconSrc: "/images/dashboard/seo/hotels.svg" },
  { id: "transportation", label: "Transportation", iconSrc: "/images/dashboard/seo/transportation.svg" },
  { id: "mice_events", label: "Mice & Events", iconSrc: "/images/dashboard/seo/mice.svg" },
  { id: "b2b", label: "B2B", iconSrc: "/images/dashboard/seo/b2b.svg" },
];

export default function SEOConfiguration() {
  const [activeTab, setActiveTab] = useState("home");
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className={styles.container}>
      <DashboardStatusBanner 
        show={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        message="Your changes have been saved successfully." 
      />
      <div className={styles.tabsContainer}>
        <DashboardTabs
          tabs={seoTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="SEO Settings Categories"
        />
      </div>

      <SEOConfigurationForm 
        key={activeTab} 
        pageKey={activeTab} 
        onSuccess={() => setShowSuccess(true)} 
      />
    </div>
  );
}

