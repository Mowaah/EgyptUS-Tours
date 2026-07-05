"use client";

import NewVsReturningCustomers from "@/components/dashboard/Analytics/NewVsReturningCustomers/NewVsReturningCustomers";
import CustomersByNationality from "@/components/dashboard/Analytics/CustomersByNationality/CustomersByNationality";
import TopCustomersByRevenueTable from "@/components/dashboard/Analytics/TopCustomersByRevenueTable/TopCustomersByRevenueTable";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";

export default function CustomerReportsPage() {
  return (
    <div className={styles.salesTab}>
      <NewVsReturningCustomers />
      
      <div className={`${styles.chartsGridHalf} ${styles.customerBottomGrid}`}>
        <div className={styles.leftColumn}>
          <CustomersByNationality />
        </div>
        
        <div className={styles.rightColumn}>
          <TopCustomersByRevenueTable />
        </div>
      </div>
    </div>
  );
}
