import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import DataTable from "@/components/dashboard/DataTable/DataTable";
import ViewButton from "@/components/shared/ViewButton/ViewButton";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import styles from "./MiceBookingsDetail.module.scss";

interface MiceBookingData {
  id: string;
  bookingId: string;
  customer: string;
  destination: string;
  dates: string;
  status: "Confirmed" | "Pending" | "Completed";
  amount: number;
}

const tableData: MiceBookingData[] = [
  { id: "1", bookingId: "BK-2026-001", customer: "Mohammad Karim", destination: "Siwa", dates: "2024-07-15", status: "Confirmed", amount: 78900 },
  { id: "2", bookingId: "BK-2026-002", customer: "Ilham Budi Agung", destination: "Giza", dates: "2024-07-15", status: "Pending", amount: 78900 },
  { id: "3", bookingId: "BK-2026-003", customer: "John Bushmill", destination: "Siwa", dates: "2024-07-15", status: "Completed", amount: 78900 },
  { id: "4", bookingId: "BK-2026-004", customer: "Linda Blair", destination: "Giza", dates: "2024-07-15", status: "Completed", amount: 78900 },
  { id: "5", bookingId: "BK-2026-005", customer: "Sarah Connor", destination: "Luxor", dates: "2024-07-16", status: "Confirmed", amount: 45000 },
  { id: "6", bookingId: "BK-2026-006", customer: "Michael Chang", destination: "Aswan", dates: "2024-07-18", status: "Pending", amount: 32000 },
];

export default function MiceBookingsDetail() {
  const columns = [
    {
      id: "bookingId",
      header: "Booking ID",
      render: (row: MiceBookingData) => <span className={styles.cellTextBold}>{row.bookingId}</span>,
    },
    {
      id: "customer",
      header: "Customer",
      render: (row: MiceBookingData) => <span className={styles.cellText}>{row.customer}</span>,
    },
    {
      id: "destination",
      header: "Destination",
      render: (row: MiceBookingData) => <span className={styles.cellText}>{row.destination}</span>,
    },
    {
      id: "dates",
      header: "Dates",
      render: (row: MiceBookingData) => <span className={styles.cellText}>{row.dates}</span>,
    },
    {
      id: "status",
      header: "Status",
      render: (row: MiceBookingData) => {
        let variant: "green" | "red" | "blue" | "orange" | "pink" | "gray" = "gray";
        if (row.status === "Confirmed") variant = "green";
        if (row.status === "Pending") variant = "orange";
        if (row.status === "Completed") variant = "blue";
        return <StatusPill label={row.status} variant={variant} />;
      },
    },
    {
      id: "amount",
      header: "Amount",
      render: (row: MiceBookingData) => (
        <span className={styles.cellTextBold}>
          $ {row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      render: (row: MiceBookingData) => <ViewButton />,
    },
  ];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/mice_booking" 
        title="MICE Bookings Detail"
        actions={<ExportButtons />}
      />
      
      <div className={styles.tableWrapper}>
        <DataTable
          data={tableData}
          columns={columns}
          getRowId={(row) => row.id}
          selectable={true}
          defaultPageSize={4}
          pageSizeOptions={[4, 10, 15]}
        />
      </div>
    </article>
  );
}
