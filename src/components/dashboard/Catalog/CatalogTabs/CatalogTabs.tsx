"use client";

import { usePathname, useRouter } from "next/navigation";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";

const TABS = [
  { id: "trips", label: "Trips", path: "/dashboard/catalog/trips", iconSrc: "/images/dashboard/catalog/trips.svg" },
  { id: "destinations", label: "Destinations", path: "/dashboard/catalog/trips/destinations", iconSrc: "/images/dashboard/catalog/destinations.svg" },
  { id: "categories", label: "Categories", path: "/dashboard/catalog/trips/categories", iconSrc: "/images/dashboard/catalog/categories.svg" },
];

export default function CatalogTabs() {
  const pathname = usePathname();
  const router = useRouter();

  // Find the most specific matching tab (longest path wins to avoid /trips matching /trips/destinations)
  const activeTab = [...TABS]
    .sort((a, b) => b.path.length - a.path.length)
    .find((tab) => pathname === tab.path || pathname.startsWith(tab.path + "/"))?.id || "trips";

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
