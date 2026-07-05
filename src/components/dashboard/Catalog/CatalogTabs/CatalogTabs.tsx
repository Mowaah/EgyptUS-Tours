"use client";

import { usePathname, useRouter } from "next/navigation";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";

const TABS = [
  { id: "trips", label: "Trips", path: "/dashboard/catalog/trips" },
  { id: "destinations", label: "Destinations", path: "/dashboard/catalog/destinations" },
  { id: "categories", label: "Categories", path: "/dashboard/catalog/categories" },
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
