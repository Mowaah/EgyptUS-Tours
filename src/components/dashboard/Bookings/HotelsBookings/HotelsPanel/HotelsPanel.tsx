"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { MOCK_HOTEL_BOOKINGS } from "../hotelsData";
import { hotelsColumns, hotelsRowActions } from "./hotelsColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { ReassignModal } from "@/components/dashboard/shared";

const filterOptions = {
  deposit: ["All", "Paid", "Pending", "Overdue"],
  status: ["All", "Upcoming", "Canceled", "Refunded", "On Trip", "Completed"],
  source: ["All", "Website", "Agent"],
};

interface HotelsPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onNewBooking?: () => void;
}

export default function HotelsPanel({ searchQuery = "", onClearSearch, onNewBooking }: HotelsPanelProps) {
  const defaultFilters = {
    deposit: "All",
    status: "All",
    source: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const router = useRouter();

  const filteredHotels = useMemo(
    () =>
      MOCK_HOTEL_BOOKINGS.filter((hotel) => {
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (!hotel.customerName.toLowerCase().includes(lowerQuery) &&
              !hotel.id.toLowerCase().includes(lowerQuery)) {
            return false;
          }
        }
        if (appliedFilters.deposit !== "All" && hotel.paymentStatus !== appliedFilters.deposit) return false;
        if (appliedFilters.status !== "All" && hotel.status !== appliedFilters.status) return false;
        if (appliedFilters.source !== "All" && hotel.source !== appliedFilters.source) return false;
        return true;
      }),
    [appliedFilters, searchQuery]
  );

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const filterFields = (
    [
      ["deposit", "Deposit", filterOptions.deposit],
      ["status", "Status", filterOptions.status],
      ["source", "Source", filterOptions.source],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  if (MOCK_HOTEL_BOOKINGS.length > 0 && filteredHotels.length === 0) {
    return (
      <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />
    );
  }

  if (MOCK_HOTEL_BOOKINGS.length === 0) {
    return (
      <DashboardEmptyState
        title="No Hotel Bookings Found"
        subtitle="Hotel bookings will appear here once they are added."
        actionLabel="New Booking"
        onAction={onNewBooking}
        imageSrc="/images/dashboard/empty-folder.svg"
      />
    );
  }

  return (
    <>
      <TablePanel
        ariaLabel="Hotels bookings table"
        title="Hotels Bookings"
        iconSrc="/images/dashboard/sidebar/hotels.svg"
        headerActions={
          <>
            <TablePanelHeaderButton iconSrc="/images/dashboard/filter.svg">
              Filters
            </TablePanelHeaderButton>
            <TablePanelHeaderButton iconSrc="/images/dashboard/export.svg">
              Export Data
            </TablePanelHeaderButton>
          </>
        }
        toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
      >
        <DataTable
          data={filteredHotels}
          columns={hotelsColumns}
          getRowId={(row) => row.id}
          selectable
          rowActions={(row) => hotelsRowActions((action, r) => {
            if (action === "View") {
              router.push(`/dashboard/bookings/hotels/${r.id}`);
            } else if (action === "Re-Assign To") {
              setSelectedRow(r);
              setReassignModalOpen(true);
            } else {
              console.log(`Action ${action} triggered for row`, r);
            }
          })}
          defaultPageSize={10}
        />
      </TablePanel>

      <ReassignModal
        open={reassignModalOpen}
        onClose={() => {
          setReassignModalOpen(false);
          setSelectedRow(null);
        }}
        onConfirm={(agentId) => {
          console.log("Reassigning to agent:", agentId, "for row:", selectedRow);
          setReassignModalOpen(false);
          setSelectedRow(null);
        }}
      />
    </>
  );
}
