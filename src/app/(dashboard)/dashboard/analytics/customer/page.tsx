"use client";

import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import NewVsReturningCustomers from "@/components/dashboard/Analytics/NewVsReturningCustomers/NewVsReturningCustomers";
import CustomersByNationality from "@/components/dashboard/Analytics/CustomersByNationality/CustomersByNationality";
import TopCustomersByRevenueTable from "@/components/dashboard/Analytics/TopCustomersByRevenueTable/TopCustomersByRevenueTable";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { fetchCustomerReports, downloadReportExport } from "@/services/admin/adminReportsService";

export default function CustomerReportsPage() {
  const searchParams = useSearchParams();
  let range = searchParams.get("range") || "this_month";
  if (range === "30d") range = "last_30";
  if (range === "7d") range = "this_week";

  const { data: reportsData, isLoading } = useSWR(
    ["/admin/reports/customers", range],
    () => fetchCustomerReports({ range }),
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading reports...</div>;
  }

  return (
    <div className={styles.salesTab}>
      <NewVsReturningCustomers data={reportsData?.new_vs_returning} actions={<ExportButtons onCsvClick={() => downloadReportExport("customers", "new_vs_returning", { range })} />} />
      
      <div className={`${styles.chartsGridHalf} ${styles.customerBottomGrid}`}>
        <div className={styles.leftColumn}>
          <CustomersByNationality data={reportsData?.customers_by_nationality} actions={<ExportButtons onCsvClick={() => downloadReportExport("customers", "customers_by_nationality", { range })} />} />
        </div>
        
        <div className={styles.rightColumn}>
          <TopCustomersByRevenueTable data={reportsData?.top_customers?.results} actions={<ExportButtons onCsvClick={() => downloadReportExport("customers", "top_customers", { range })} />} />
        </div>
      </div>
    </div>
  );
}
