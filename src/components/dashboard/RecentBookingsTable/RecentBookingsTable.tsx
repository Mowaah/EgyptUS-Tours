"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import { bookingColumns, bookingRowActions } from "./bookingColumns";
import { mockBookings } from "./mockBookings";

export default function RecentBookingsTable() {
  const rows = useMemo(
    () =>
      Array.from({ length: 15 }, (_, index) => {
        const booking = mockBookings[index % mockBookings.length];
        const bookingNumber = 1284 - index;

        return {
          ...booking,
          id: `BK-${bookingNumber}`,
          status: index % 5 === 0 ? "Confirmed" : booking.status,
        };
      }),
    []
  );

  return (
    <DataTable
      data={rows}
      columns={bookingColumns}
      getRowId={(row) => row.id}
      selectable
      rowActions={bookingRowActions}
    />
  );
}
