import { useState } from "react";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import { DataTable } from "@/components/dashboard/DataTable";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import { bookingHistoryColumns } from "./bookingHistoryColumns";
import { useAdminCustomerBookings } from "@/hooks/useCustomers";

export default function BookingHistoryPanel({ customerId }: { customerId: string }) {
  const [page, setPage] = useState(1);
  const { data: pageData, isLoading } = useAdminCustomerBookings(customerId, page);

  const data = pageData?.results || [];

  const filterFields = [
    {
      id: "service",
      label: "Service",
      value: "All",
      options: ["All", "Trips", "Hotels", "Transportation"],
      onChange: (v: string) => console.log(v),
    },
    {
      id: "date",
      label: "Date",
      value: "All",
      options: ["All", "Last 30 Days"],
      onChange: (v: string) => console.log(v),
    },
    {
      id: "status",
      label: "Status",
      value: "All",
      options: ["All", "Upcoming", "Completed", "Canceled"],
      onChange: (v: string) => console.log(v),
    },
  ];

  if (!isLoading && data.length === 0) {
    return (
      <DashboardEmptyState
        title="No Bookings Yet"
        subtitle="Booking data will appear here once reservations are made"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Customer booking history"
      title="Bookings"
      iconSrc="/images/dashboard/reviews/modal/name.svg"
      showFilters
      showExport
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={() => {}} onApply={() => {}} />}
    >
      <DataTable
        data={data}
        columns={bookingHistoryColumns as any}
        getRowId={(row: any) => row.id.toString()}
      isLoading={isLoading}
        />
    </TablePanel>
  );
}
