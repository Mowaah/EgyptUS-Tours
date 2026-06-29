"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { mockTripsData } from "../tripsData";
import { tripsColumns, tripsRowActions } from "./tripsColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { ReassignModal } from "@/components/dashboard/shared";;

const filterOptions = {
  tourType: ["All", "Private", "Group"],
  deposit: ["All", "Paid", "Pending", "Overdue"],
  status: ["All", "Upcoming", "Canceled", "Refunded", "On Trip", "Completed"],
  source: ["All", "Website", "Agent"],
};

interface TripsPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onNewBooking?: () => void;
}

export default function TripsPanel({ searchQuery = "", onClearSearch, onNewBooking }: TripsPanelProps) {
  const defaultFilters = {
    tourType: "All",
    deposit: "All",
    status: "All",
    source: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const router = useRouter();

  const filteredTrips = useMemo(
    () =>
      mockTripsData.filter((trip) => {
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (!trip.customerName.toLowerCase().includes(lowerQuery) &&
              !trip.id.toLowerCase().includes(lowerQuery) &&
              !trip.tripName.toLowerCase().includes(lowerQuery)) {
            return false;
          }
        }
        if (appliedFilters.tourType !== "All" && trip.tourType !== appliedFilters.tourType) return false;
        if (appliedFilters.deposit !== "All" && trip.depositStatus !== appliedFilters.deposit) return false;
        if (appliedFilters.status !== "All" && trip.status !== appliedFilters.status) return false;
        if (appliedFilters.source !== "All" && trip.source !== appliedFilters.source) return false;
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
      ["tourType", "Tour Type", filterOptions.tourType],
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

  if (mockTripsData.length > 0 && filteredTrips.length === 0) {
    return (
      <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />
    );
  }

  if (mockTripsData.length === 0) {
    return (
      <DashboardEmptyState
        title="No Trips Found"
        subtitle="Trips bookings will appear here once they are added."
        actionLabel="New Booking"
        onAction={onNewBooking}
        imageSrc="/images/dashboard/empty-folder.svg"
      />
    );
  }

  return (
    <>
      <TablePanel
        ariaLabel="Trips bookings table"
        title="Trips"
        iconSrc="/images/dashboard/sidebar/trips.svg"
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
          data={filteredTrips}
          columns={tripsColumns}
          getRowId={(row) => row.id}
          selectable
          rowActions={(row) => tripsRowActions((action, r) => {
            if (action === "View") {
              router.push(`/dashboard/bookings/trips/${r.id}`);
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
