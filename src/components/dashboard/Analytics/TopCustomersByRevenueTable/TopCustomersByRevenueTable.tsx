import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import DataTable from "@/components/dashboard/DataTable/DataTable";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import styles from "./TopCustomersByRevenueTable.module.scss";

interface CustomerData {
  id: string;
  name: string;
  bookings: number;
  type: string;
  amount: number;
}

const tableData: CustomerData[] = [
  { id: "1", name: "Mohammad Karim", bookings: 40, type: "Corporate", amount: 512000 },
  { id: "2", name: "Ilham Budi Agung", bookings: 50, type: "Individual", amount: 512000 },
  { id: "3", name: "John Bushmill", bookings: 80, type: "Corporate", amount: 512000 },
  { id: "4", name: "Linda Blair", bookings: 65, type: "Individual", amount: 512000 },
  { id: "5", name: "Sarah Connor", bookings: 45, type: "Corporate", amount: 342000 },
  { id: "6", name: "Michael Chang", bookings: 30, type: "Individual", amount: 215000 },
  { id: "7", name: "Emma Watson", bookings: 55, type: "Corporate", amount: 480000 },
];

export default function TopCustomersByRevenueTable() {
  const columns = [
    {
      id: "customer",
      header: "Customer",
      render: (row: CustomerData) => <span className={styles.cellText}>{row.name}</span>,
    },
    {
      id: "bookings",
      header: "Bookings",
      render: (row: CustomerData) => <span className={styles.cellText}>{row.bookings}</span>,
    },
    {
      id: "type",
      header: "Type",
      render: (row: CustomerData) => <span className={styles.cellText}>{row.type}</span>,
    },
    {
      id: "amount",
      header: "Amount",
      render: (row: CustomerData) => (
        <span className={styles.cellText}>
          $ {row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      render: (row: CustomerData) => <ViewButton />,
    },
  ];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="finance/payment/chart" 
        title="Top Customers by Revenue"
        actions={<ExportButtons />}
      />
      
      <div className={styles.tableWrapper}>
        <DataTable
          className={styles.compactTable}
          data={tableData}
          columns={columns}
          getRowId={(row) => row.id}
          
          defaultPageSize={4}
          pageSizeOptions={[4, 10, 20]}
        />
      </div>
    </article>
  );
}
