"use client";

import useSWR from "swr";
import NewVsReturningCustomers from "@/components/dashboard/Analytics/NewVsReturningCustomers/NewVsReturningCustomers";
import CustomersByNationality from "@/components/dashboard/Analytics/CustomersByNationality/CustomersByNationality";
import TopCustomersByRevenueTable from "@/components/dashboard/Analytics/TopCustomersByRevenueTable/TopCustomersByRevenueTable";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { fetchCustomerReports, downloadReportExport } from "@/services/admin/adminReportsService";
import { useReportsFilter } from "@/hooks/useReportsFilter";

export default function CustomerReportsPage() {
  const filterParams = useReportsFilter();

  const { data: reportsData, isLoading } = useSWR(
    ["/admin/reports/customers", filterParams],
    () => fetchCustomerReports(filterParams),
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return <div className={styles.loadingState}>Loading reports...</div>;
  }

  return (
    <div className={styles.salesTab}>
      <NewVsReturningCustomers data={reportsData?.new_vs_returning} actions={<ExportButtons onCsvClick={() => downloadReportExport("customers", "new_vs_returning", filterParams)} />} />
      
      <div className={`${styles.chartsGridHalf} ${styles.customerBottomGrid}`}>
        <div className={styles.leftColumn}>
          <CustomersByNationality data={reportsData?.customers_by_nationality} actions={<ExportButtons onCsvClick={() => downloadReportExport("customers", "customers_by_nationality", filterParams)} />} />
        </div>
        
        <div className={styles.rightColumn}>
          <TopCustomersByRevenueTable data={reportsData?.top_customers?.results} actions={<ExportButtons onCsvClick={() => downloadReportExport("customers", "top_customers", filterParams)} />} />
        </div>
      </div>
    </div>
  );
}
