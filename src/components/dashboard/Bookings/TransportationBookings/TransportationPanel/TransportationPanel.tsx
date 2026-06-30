"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { mockTransportationData } from "../transportationData";
import { transportationColumns, transportationRowActions } from "./transportationColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { ReassignModal } from "@/components/dashboard/shared";

const filterOptions = {
  vehicleClass: ["All", "Mercedes V-Class", "Toyota Coaster", "Bus (50 Seats)", "Hyundai H1"],
  tripType: ["All", "One Way", "Round Trip"],
  deposit: ["All", "Paid", "Pending", "Overdue"],
  status: ["All", "Upcoming", "Canceled", "Refunded", "On Trip", "Completed"],
  source: ["All", "Website", "Agent"],
};

interface TransportationPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onNewBooking?: () => void;
}

export default function TransportationPanel({ searchQuery = "", onClearSearch, onNewBooking }: TransportationPanelProps) {
  const defaultFilters = {
    vehicleClass: "All",
    tripType: "All",
    deposit: "All",
    status: "All",
    source: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const router = useRouter();

  const filteredData = useMemo(
    () =>
      mockTransportationData.filter((booking) => {
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (!booking.customerName.toLowerCase().includes(lowerQuery) &&
              !booking.id.toLowerCase().includes(lowerQuery) &&
              !booking.route.toLowerCase().includes(lowerQuery)) {
            return false;
          }
        }
        if (appliedFilters.vehicleClass !== "All" && booking.vehicleClass !== appliedFilters.vehicleClass) return false;
        if (appliedFilters.tripType !== "All" && booking.tripType !== appliedFilters.tripType) return false;
        if (appliedFilters.deposit !== "All" && booking.depositStatus !== appliedFilters.deposit) return false;
        if (appliedFilters.status !== "All" && booking.status !== appliedFilters.status) return false;
        if (appliedFilters.source !== "All" && booking.source !== appliedFilters.source) return false;
        return true;
      }),
    [appliedFilters, searchQuery]
  );

  const applyFilters = () => setAppliedFilters(filters);
  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const filterFields = [
    { id: "vehicleClass", label: "Vehicle Class", options: filterOptions.vehicleClass },
    { id: "tripType", label: "Trip Type", options: filterOptions.tripType },
    { id: "deposit", label: "Deposit", options: filterOptions.deposit },
    { id: "status", label: "Status", options: filterOptions.status },
    { id: "source", label: "Source", options: filterOptions.source },
  ].map(({ id, label, options }) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  if (mockTransportationData.length > 0 && filteredData.length === 0) {
    return (
      <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />
    );
  }

  if (mockTransportationData.length === 0) {
    return (
      <DashboardEmptyState
        title="No Transportation Bookings Found"
        subtitle="Transportation bookings will appear here once they are added."
        actionLabel="New Booking"
        onAction={onNewBooking}
        imageSrc="/images/dashboard/empty-folder.svg"
      />
    );
  }

  return (
    <>
      <TablePanel
        ariaLabel="Transportation bookings table"
        title="Transportation Bookings"
        iconSrc="/images/dashboard/sidebar/transportation.svg"
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
          data={filteredData}
          columns={transportationColumns}
          getRowId={(row) => row.id}
          selectable
          rowActions={(row) => transportationRowActions((action, r) => {
            if (action === "View") {
              router.push(`/dashboard/bookings/transportation/${r.id}`);
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
