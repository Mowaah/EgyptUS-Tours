"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import useSWR from "swr";
import { getTransportationBookings, reassignBooking, sendTransportationBookingReminder } from "@/services/admin/adminBookingsService";
import { getAdminUsers } from "@/services/admin/adminUsersService";
import { transportationColumns, transportationRowActions } from "./transportationColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import { triggerToast } from "@/components/dashboard/shared/GlobalToastContainer/GlobalToastContainer";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { ReassignModal } from "@/components/dashboard/shared";

const filterOptions = {
  vehicleClass: ["All", "Mercedes V-Class", "Toyota Coaster", "Bus (50 Seats)", "Hyundai H1"],
  tripType: ["All", "One Way", "Round Trip"],
  paymentStatus: ["All", "Paid", "Pending", "Overdue"],
  status: ["All", "Upcoming", "In Transit", "Completed", "Cancelled"],
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
    if (appliedFilters.vehicleClass !== "All") params.vehicle_class = appliedFilters.vehicleClass;
    if (appliedFilters.tripType !== "All") {
      const tripTypeMap: Record<string, string> = { "One Way": "one_way", "Round Trip": "round_trip" };
      params.trip_type = tripTypeMap[appliedFilters.tripType] ?? appliedFilters.tripType.toLowerCase().replace(" ", "_");
    }
    if (appliedFilters.paymentStatus !== "All") {
      const payMap: Record<string, string> = { Paid: "paid", Pending: "pending", Overdue: "overdue" };
      params.remaining_payment_status = payMap[appliedFilters.paymentStatus] ?? appliedFilters.paymentStatus.toLowerCase();
    }
    if (appliedFilters.status !== "All") {
      const statusMap: Record<string, string> = {
        Upcoming: "upcoming",
        "In Transit": "in_transit",
        Completed: "completed",
        Cancelled: "cancelled",
      };
      params.operational_status = statusMap[appliedFilters.status] ?? appliedFilters.status.toLowerCase().replace(" ", "_");
    }
    if (appliedFilters.source !== "All") {
      params.source = appliedFilters.source === "Agent" ? "admin" : "website";
    }
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
    { id: "paymentStatus", label: "Payment Status", options: filterOptions.paymentStatus },
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



  return (
    <>
      <TablePanel
        ariaLabel="Transportation bookings table"
        title="Transportation"
        iconSrc="/images/dashboard/sidebar/transportation.svg"
        showFilters
        showExport
        toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
      >
        <DataTable
          data={transportationData}
          columns={transportationColumns}
          getRowId={(row) => String(row.id)}
          selectable
          rowActions={(row) => transportationRowActions(async (action, r) => {
            if (action === "View") {
              router.push(`/dashboard/bookings/transportation/${r.id}`);
            } else if (action === "Re-Assign To") {
              setSelectedRow(r);
              setReassignModalOpen(true);
            } else if (action === "Send Email Reminder") {
              try {
                await sendTransportationBookingReminder(r.id);
                triggerToast("Email reminder sent successfully.", "success");
              } catch (err: any) {
                triggerToast(err?.response?.data?.payment?.[0] || err?.response?.data?.detail || "Failed to send email reminder.");
              }
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
          isLoading={isLoading}
          onClearSearch={onClearSearch || resetFilters}
          emptyState={
            !searchQuery && Object.values(appliedFilters).every((v) => v === "All") ? (
              <DashboardEmptyState
                title="No Bookings Found"
                subtitle="Transportation bookings will appear here once they are added."
                actionLabel="New Booking"
                onAction={onNewBooking}
                imageSrc="/images/dashboard/empty.png"
              />
            ) : !searchQuery && Object.values(appliedFilters).some((v) => v !== "All") ? (
              <DashboardFilterEmptyState
                onClearFilters={onClearSearch || resetFilters}
                title="No Results Found"
                subtitle="No results match the selected filters."
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
