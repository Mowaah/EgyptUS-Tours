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
import { getHotelBookings, reassignBooking } from "@/services/admin/adminBookingsService";
import { getAdminUsers } from "@/services/admin/adminUsersService";
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

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page: pageIndex + 1,
      page_size: pageSize,
    };
    if (searchQuery) params.search = searchQuery;
    if (appliedFilters.deposit !== "All") params.payment_status = appliedFilters.deposit.toLowerCase().replace(" ", "_");
    if (appliedFilters.status !== "All") params.operational_status = appliedFilters.status.toLowerCase().replace(" ", "_");
    if (appliedFilters.source !== "All") params.source = appliedFilters.source.toLowerCase();
    return params;
  }, [appliedFilters, searchQuery, pageIndex, pageSize]);

  const { data, mutate, isLoading } = useSWR(
    ["/bookings/hotels", queryParams],
    () => getHotelBookings(queryParams)
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

  const hotelsData = data?.results || [];
  const totalCount = data?.count || 0;

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

  if (totalCount === 0 && (searchQuery || Object.values(appliedFilters).some(v => v !== "All"))) {
    return (
      <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />
    );
  }

  if (totalCount === 0 && !isLoading) {
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
        title="Hotels"
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
          data={hotelsData}
          columns={hotelsColumns}
          getRowId={(row) => String(row.id)}
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
            await reassignBooking("hotels", selectedRow.id, agentId);
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
