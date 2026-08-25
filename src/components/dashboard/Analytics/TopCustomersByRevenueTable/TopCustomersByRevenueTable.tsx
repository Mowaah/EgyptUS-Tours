import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import DataTable from "@/components/dashboard/DataTable/DataTable";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import styles from "./TopCustomersByRevenueTable.module.scss";

import { TopCustomer } from "@/services/admin/adminReportsService";

export default function TopCustomersByRevenueTable({ 
  data, 
  actions 
}: { 
  data?: TopCustomer[]; 
  actions?: React.ReactNode; 
}) {
  const columns = [
    {
      id: "customer",
      header: "Customer",
      render: (row: TopCustomer) => <span className={styles.cellText}>{row.customer_name}</span>,
    },
    {
      id: "email",
      header: "Email",
      render: (row: TopCustomer) => <span className={styles.cellText}>{row.email}</span>,
    },
    {
      id: "amount",
      header: "Amount",
      render: (row: TopCustomer) => (
        <span className={styles.cellText}>
          £{parseFloat(row.total_revenue).toLocaleString()}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      render: (row: TopCustomer) => <ViewButton />,
    },
  ];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="finance/payment/chart" 
        title="Top Customers by Revenue"
        actions={actions}
      />
      
      <div className={styles.tableWrapper}>
        <DataTable
          className={styles.compactTable}
          data={data || []}
          columns={columns}
          getRowId={(row) => row.email}
          
          defaultPageSize={4}
          pageSizeOptions={[4, 10, 20]}
        />
      </div>
    </article>
  );
}
