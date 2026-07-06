"use client";

import { usePathname, useRouter } from "next/navigation";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";

const TABS = [
  { id: "trips", label: "Trips", path: "/dashboard/catalog/trips", iconSrc: "/images/dashboard/catalog/trips.svg" },
  { id: "destinations", label: "Destinations", path: "/dashboard/catalog/destinations", iconSrc: "/images/dashboard/catalog/destinations.svg" },
  { id: "categories", label: "Categories", path: "/dashboard/catalog/categories", iconSrc: "/images/dashboard/catalog/categories.svg" },
];

export default function CatalogTabs() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab based on pathname
  const activeTab = TABS.find((tab) => pathname.includes(tab.path))?.id || "trips";

  const handleTabChange = (tabId: string) => {
    const selectedTab = TABS.find((tab) => tab.id === tabId);
    if (selectedTab) {
      router.push(selectedTab.path);
    }
  };

  return (
      <DashboardTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        ariaLabel="Catalog Tabs"
      />
  );
}
