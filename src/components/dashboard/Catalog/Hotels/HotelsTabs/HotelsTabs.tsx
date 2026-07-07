"use client";

import { usePathname, useRouter } from "next/navigation";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";

const TABS = [
  { id: "hotels", label: "Hotels", path: "/dashboard/catalog/hotels", iconSrc: "/images/dashboard/sidebar/hotels.svg" },
  { id: "locations", label: "Locations", path: "/dashboard/catalog/hotels/locations", iconSrc: "/images/dashboard/catalog/destinations.svg" },
];

export default function HotelsTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = TABS.find((tab) => pathname === tab.path || pathname.startsWith(tab.path + "/"))?.id || "hotels";

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
        ariaLabel="Hotels Tabs"
      />
  );
}
