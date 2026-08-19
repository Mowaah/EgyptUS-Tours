"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import useSWR from "swr";
import { getTransportationBookings, reassignBooking } from "@/services/admin/adminBookingsService";
import { getAdminUsers } from "@/services/admin/adminUsersService";
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

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page: pageIndex + 1,
      page_size: pageSize,
    };
    if (searchQuery) params.search = searchQuery;
    if (appliedFilters.vehicleClass !== "All") params.vehicle_class = appliedFilters.vehicleClass.toLowerCase().replace(" ", "_");
    if (appliedFilters.tripType !== "All") params.trip_type = appliedFilters.tripType.toLowerCase().replace(" ", "_");
    if (appliedFilters.deposit !== "All") params.payment_status = appliedFilters.deposit.toLowerCase().replace(" ", "_");
    if (appliedFilters.status !== "All") params.operational_status = appliedFilters.status.toLowerCase().replace(" ", "_");
    if (appliedFilters.source !== "All") params.source = appliedFilters.source.toLowerCase();
    return params;
  }, [appliedFilters, searchQuery, pageIndex, pageSize]);

  const { data, mutate, isLoading } = useSWR(
    ["/bookings/transportation", queryParams],
    () => getTransportationBookings(queryParams)
  );

  const { data: usersData } = useSWR(
    "/admin/users",
    () => getAdminUsers({ page_size: 100 })
  );

  const realAgents = usersData?.results?.map((user: any) => ({
    id: String(user.id),
    name: user.full_name || `${user.first_name} ${user.last_name}`,
    avatarSrc: user.profile_picture || "/images/dashboard/default-avatar.png"
  })) || [];

  const transportationData = data?.results || [];
  const totalCount = data?.count || 0;

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

  if (totalCount === 0 && (searchQuery || Object.values(appliedFilters).some(v => v !== "All"))) {
    return (
      <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />
    );
  }

  if (totalCount === 0 && !isLoading) {
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
        title="Transportation"
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
          data={transportationData}
          columns={transportationColumns}
          getRowId={(row) => String(row.id)}
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
          serverSidePagination={true}
          totalCount={totalCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
          defaultPageSize={10}
        />
      </TablePanel>

      <ReassignModal
        open={reassignModalOpen}
        agents={realAgents.length > 0 ? realAgents : undefined}
        onClose={() => {
          setReassignModalOpen(false);
          setSelectedRow(null);
        }}
        onConfirm={async (agentId) => {
          try {
            await reassignBooking("transportation", selectedRow.id, agentId);
            setReassignModalOpen(false);
            setSelectedRow(null);
            mutate();
          } catch (error) {
            console.error("Failed to reassign booking", error);
          }
        }}
      />
    </>
  );
}
