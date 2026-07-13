"use client";

import { usePathname, useRouter } from "next/navigation";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";

const TABS = [
  { id: "vehicles", label: "Vehicles", path: "/dashboard/catalog/transportation", iconSrc: "/images/dashboard/sidebar/transportation.svg" },
  { id: "categories", label: "Categories", path: "/dashboard/catalog/transportation/categories", iconSrc: "/images/dashboard/catalog/categories.svg" },
  { id: "additional-services", label: "Additional Services", path: "/dashboard/catalog/transportation/additional-services", iconSrc: "/images/dashboard/catalog/destinations.svg" }, // Assuming a generic icon for now
];

export default function TransportationTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = [...TABS].sort((a, b) => b.path.length - a.path.length).find((tab) => pathname === tab.path || pathname.startsWith(tab.path + "/"))?.id || "vehicles";

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
      ariaLabel="Transportation Tabs"
    />
  );
}
