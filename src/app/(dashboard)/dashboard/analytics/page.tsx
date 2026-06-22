import { Metadata } from "next";
import ReportsAnalyticsPage from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage";

export const metadata: Metadata = {
  title: "Reports & Analytics | Egypt US",
  description: "Comprehensive reports across customers, operations, sales, and leads.",
};

import { Suspense } from "react";

export default function Page() {
  return <ReportsAnalyticsPage />;
}
