"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "operational", label: "Operational Reports", href: "/dashboard/analytics/operational" },
  { id: "sales", label: "Sales & Revenue", href: "/dashboard/analytics/sales" },
  { id: "lead", label: "Lead & Conversion", href: "/dashboard/analytics/lead" },
  { id: "customer", label: "Customer Reports", href: "/dashboard/analytics/customer" },
  { id: "mice", label: "MICE-Specific Reports", href: "/dashboard/analytics/mice" },
];

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeTab = pathname?.split("/").pop() || "operational";

  return (
    <>
      <DashboardNavbar
        title="Reports & Analytics"
        subtitle="Comprehensive reports across customers, operations, sales, and leads — plus a custom builder."
        searchPlaceholder="Search bookings, customers..."
      />

      <DashboardTabs
        tabs={tabs}
        activeTab={activeTab}
      />

      {children}
    </>
  );
}
