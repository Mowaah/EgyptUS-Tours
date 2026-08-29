"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import useSWR from "swr";
import { getTripBookings, reassignBooking, sendTripBookingReminder } from "@/services/admin/adminBookingsService";
import { getAdminUsers } from "@/services/admin/adminUsersService";
import { tripsColumns, tripsRowActions } from "./tripsColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import { triggerToast } from "@/components/dashboard/shared/GlobalToastContainer/GlobalToastContainer";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { ReassignModal } from "@/components/dashboard/shared";

const filterOptions = {
  tourType: ["All", "Private", "Group"],
  paymentStatus: ["All", "Paid", "Pending", "Overdue"],
  status: ["All", "Upcoming", "On Trip", "Completed", "Cancelled", "Refunded"],
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
    paymentStatus: "All",
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
    if (appliedFilters.tourType !== "All") params.tour_type = appliedFilters.tourType.toLowerCase();
    if (appliedFilters.paymentStatus !== "All") {
      // Map display label to backend value
      const payMap: Record<string, string> = { Paid: "paid", Pending: "pending", Overdue: "overdue" };
      params.remaining_payment_status = payMap[appliedFilters.paymentStatus] ?? appliedFilters.paymentStatus.toLowerCase();
    }
    if (appliedFilters.status !== "All") {
      const statusMap: Record<string, string> = {
        Upcoming: "upcoming",
        "On Trip": "on_trip",
        Completed: "completed",
        Cancelled: "cancelled",
        Refunded: "cancelled",
      };
      params.operational_status = statusMap[appliedFilters.status] ?? appliedFilters.status.toLowerCase().replace(" ", "_");
    }
    if (appliedFilters.source !== "All") {
      params.source = appliedFilters.source === "Agent" ? "admin" : "website";
    }
    return params;
  }, [appliedFilters, searchQuery, pageIndex, pageSize]);

  const { data, mutate, isLoading } = useSWR(
    ["/bookings/trips", queryParams],
    () => getTripBookings(queryParams)
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

  const tripsData = data?.results || [];
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
      ["tourType", "Tour Type", filterOptions.tourType],
      ["paymentStatus", "Payment Status", filterOptions.paymentStatus],
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



  return (
    <>
      <TablePanel
        ariaLabel="Trips bookings table"
        title="Trips"
        iconSrc="/images/dashboard/sidebar/trips.svg"
        showFilters
        showExport
        toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
      >
        <DataTable
          data={tripsData}
          columns={tripsColumns}
          getRowId={(row) => String(row.id)}
          selectable
          rowActions={(row) => tripsRowActions(async (action, r) => {
            if (action === "View") {
              router.push(`/dashboard/bookings/trips/${r.id}`);
            } else if (action === "Re-Assign To") {
              setSelectedRow(r);
              setReassignModalOpen(true);
            } else if (action === "Send Email Reminder") {
              try {
                await sendTripBookingReminder(r.id);
                triggerToast("Email reminder sent successfully.", "success");
              } catch (err: any) {
                triggerToast(err?.response?.data?.payment?.[0] || err?.response?.data?.detail || "Failed to send email reminder.");
              }
            }
          })}
          serverSidePagination={true}
          totalCount={totalCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
          defaultPageSize={10}
          isLoading={isLoading}
          onClearSearch={onClearSearch || resetFilters}
          emptyState={
            !searchQuery && Object.values(appliedFilters).every((v) => v === "All") ? (
              <DashboardEmptyState
                title="No Trips Found"
                subtitle="Trips bookings will appear here once they are added."
                actionLabel="New Booking"
                onAction={onNewBooking}
                imageSrc="/images/dashboard/empty.png"
              />
            ) : !searchQuery && Object.values(appliedFilters).some((v) => v !== "All") ? (
              <DashboardFilterEmptyState
                onClearFilters={onClearSearch || resetFilters}
                title="No Trips Found"
                subtitle="No trips match the selected filters."
              />
            ) : undefined
          }
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
            await reassignBooking("trips", selectedRow.id, agentId);
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
