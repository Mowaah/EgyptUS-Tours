"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { catalogTripsColumns, catalogTripsRowActions } from "./catalogTripsColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import { useCatalogTrips, useCatalogFilters } from "@/hooks/useCatalogTrips";
import { archiveCatalogTrip, deleteCatalogTrip, updateCatalogTrip } from "@/services/admin/adminCatalogTripsService";

const staticFilterOptions = {
  duration: ["All", "1-3 Days", "4-7 Days", "8-14 Days", "15+ Days"],
  startingFrom: ["All", "Under £1,000", "£1,000 - 2,000", "Over £2,000"],
  status: ["All", "Published", "Archived", "Draft"],
};

interface TripsPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function TripsPanel({ searchQuery = "", onClearSearch }: TripsPanelProps) {
  const router = useRouter();

  const { categories, destinations, loading: filtersLoading } = useCatalogFilters();
  
  const categoryOptions = ["All", ...Array.from(new Set(categories.map((c: any) => c.name || c.title).filter(Boolean)))];
  const destinationOptions = ["All", ...Array.from(new Set(destinations.map((d: any) => d.name || d.title).filter(Boolean)))];
  
  const defaultFilters = {
    category: "All",
    destination: "All",
    duration: "All",
    startingFrom: "All",
    status: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; action: "Archive" | "Delete" | null; row: any }>({ open: false, action: null, row: null });
  const [banner, setBanner] = useState<{ show: boolean; message: string; variant: "success" | "warning" }>({ show: false, message: "", variant: "success" });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryParams = useMemo(() => {
    const params: any = { page, page_size: pageSize };
    if (searchQuery) params.search = searchQuery;
    if (appliedFilters.status !== "All") params.status = appliedFilters.status.toLowerCase();
    
    if (appliedFilters.category !== "All") {
      const cat = categories.find((c: any) => (c.name || c.title) === appliedFilters.category);
      if (cat) params.tag = cat.slug;
    }
    
    if (appliedFilters.destination !== "All") {
      const dest = destinations.find((d: any) => (d.name || d.title) === appliedFilters.destination);
      if (dest) params.destination = dest.slug;
    }
    
    if (appliedFilters.duration !== "All") {
      if (appliedFilters.duration === "1-3 Days") { params.min_duration = 1; params.max_duration = 3; }
      else if (appliedFilters.duration === "4-7 Days") { params.min_duration = 4; params.max_duration = 7; }
      else if (appliedFilters.duration === "8-14 Days") { params.min_duration = 8; params.max_duration = 14; }
      else if (appliedFilters.duration === "15+ Days") { params.min_duration = 15; }
    }
    
    if (appliedFilters.startingFrom !== "All") {
      if (appliedFilters.startingFrom === "Under £1,000") { params.max_price = 1000; }
      else if (appliedFilters.startingFrom === "£1,000 - 2,000") { params.min_price = 1000; params.max_price = 2000; }
      else if (appliedFilters.startingFrom === "Over £2,000") { params.min_price = 2000; }
    }
    
    return params;
  }, [appliedFilters, searchQuery, categories, destinations, page, pageSize]);

  const { data: tripsData, loading: tripsLoading, totalCount, refetch } = useCatalogTrips(queryParams);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const filterFields = (
    [
      ["category", "Category", categoryOptions],
      ["destination", "Destination", destinationOptions],
      ["duration", "Duration", staticFilterOptions.duration],
      ["startingFrom", "Starting From", staticFilterOptions.startingFrom],
      ["status", "Status", staticFilterOptions.status],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options: options as any[],
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  const handleConfirmAction = async () => {
    if (!confirmModal.row || !confirmModal.action) return;
    try {
      if (confirmModal.action === "Archive") {
        await archiveCatalogTrip(confirmModal.row.id);
        setBanner({ show: true, message: "The trip has been archived successfully and is no longer visible in the active trips list", variant: "success" });
      } else if (confirmModal.action === "Delete") {
        await deleteCatalogTrip(confirmModal.row.id);
        setBanner({ show: true, message: "The trip has been deleted successfully", variant: "success" });
      }
      refetch();
    } catch (err) {
      console.error(`Failed to ${confirmModal.action} trip:`, err);
      setBanner({ show: true, message: `Failed to ${confirmModal.action.toLowerCase()} trip.`, variant: "warning" });
    } finally {
      setConfirmModal({ open: false, action: null, row: null });
    }
  };

  const handleSelectionChange = async (rowId: string, isSelected: boolean) => {
    try {
      await updateCatalogTrip(rowId, { is_featured: isSelected });
      refetch();
    } catch (err) {
      console.error("Failed to update featured status:", err);
      setBanner({ show: true, message: "Failed to update featured status.", variant: "warning" });
    }
  };



  return (
    <TablePanel
      ariaLabel="Catalog trips table"
      title="Trips Packages"
      iconSrc="/images/dashboard/catalog/trips.svg"
      showFilters
      showExport
      onExportClick={() => {}}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={tripsData}
        columns={catalogTripsColumns}
        getRowId={(row) => String(row.id)}
        selectable
        selectionType="star"
        selectedRowIds={tripsData.filter((t: any) => t.is_featured).map((t: any) => String(t.id))}
        onSelectionChange={handleSelectionChange}
        serverSidePagination={true}
        totalCount={totalCount}
        pageIndex={page - 1}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p + 1)}
        onPageSizeChange={setPageSize}
        defaultPageSize={10}
        rowActions={(row) =>
          catalogTripsRowActions(row, (action, r) => {
            if (action === "View") {
              router.push(`/dashboard/catalog/trips/${r.id}`);
            } else if (action === "Edit") {
              router.push(`/dashboard/catalog/trips/${r.id}/edit`);
            } else if (action === "Archive") {
              setConfirmModal({ open: true, action: "Archive", row: r });
            } else if (action === "Delete") {
              setConfirmModal({ open: true, action: "Delete", row: r });
            }
          })
        }
        isLoading={tripsLoading}
        onClearSearch={onClearSearch || resetFilters}
        emptyState={
          !searchQuery && Object.values(appliedFilters).every((v) => v === "All") ? (
            <DashboardEmptyState
              title="No Trips Found"
              subtitle="Catalog trips will appear here once they are created."
              actionLabel="Add New Trip"
              onAction={() => router.push("/dashboard/catalog/trips/new")}
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
      <DashboardConfirmationModal
        open={confirmModal.open}
        variant={confirmModal.action === "Delete" ? "delete" : "activate"}
        title={confirmModal.action === "Delete" ? "Delete Trip" : "Archive Trip?"}
        message={
          confirmModal.action === "Delete"
            ? `Are you sure you want to delete "${confirmModal.row?.title}"? This action cannot be undone.`
            : "The trip will no longer be available for bookings or visible in the catalog, but you can restore it at any time."
        }
        confirmLabel={confirmModal.action === "Delete" ? "Yes, delete it" : "Archive Trip"}
        cancelLabel={confirmModal.action === "Delete" ? "Keep it" : "Cancel"}
        onClose={() => setConfirmModal({ open: false, action: null, row: null })}
        onConfirm={handleConfirmAction}
      />
      <DashboardStatusBanner
        show={banner.show}
        variant={banner.variant}
        message={banner.message}
        onClose={() => setBanner({ show: false, message: "", variant: "success" })}
      />
    </TablePanel>
  );
}
