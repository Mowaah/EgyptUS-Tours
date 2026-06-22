import { Metadata } from "next";
import FinancialReportsPage from "@/components/dashboard/Finance/Reports/FinancialReportsPage/FinancialReportsPage";

export const metadata: Metadata = {
  title: "Financial Reports | Egypt US Tours",
  description: "Overview of financial performance across bookings and payments.",
};

export default function Page() {
  return <FinancialReportsPage />;
}
