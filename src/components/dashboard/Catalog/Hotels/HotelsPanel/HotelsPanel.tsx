"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import { useCatalogHotels, useCatalogHotelLocations } from "@/hooks/useCatalogHotels";
import { archiveCatalogHotel, deleteCatalogHotel, updateCatalogHotel } from "@/services/admin/adminCatalogHotelsService";
import { catalogHotelsColumns, catalogHotelsRowActions } from "./catalogHotelsColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";

const staticFilterOptions = {
  rating: ["All", "5", "4", "3", "2", "1", "Unrated"],
  startingFrom: ["All", "Under £1,000", "£1,000 - 2,000", "Over £2,000"],
  status: ["All", "Published", "Archived", "Draft"],
};

interface CatalogHotelLocation {
  id: string | number;
  name?: string;
}

interface CatalogHotelRow {
  id: string | number;
  name?: string;
  hotelName?: string;
  is_featured?: boolean;
}

interface HotelsPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function HotelsPanel({ searchQuery = "", onClearSearch }: HotelsPanelProps) {
  const router = useRouter();
  
  const defaultFilters = {
    destination: "All",
    rating: "All",
    startingFrom: "All",
    status: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; action: "Archive" | "Delete" | null; row: CatalogHotelRow | null }>({ open: false, action: null, row: null });
  const [banner, setBanner] = useState<{ show: boolean; message: string; variant: "success" | "warning" }>({ show: false, message: "", variant: "success" });
  const { locations } = useCatalogHotelLocations();
  const locationOptions = [
    "All",
    ...Array.from(new Set((locations as CatalogHotelLocation[]).map((l) => l.name).filter((name): name is string => Boolean(name)))),
  ];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = { page, page_size: pageSize };
    if (searchQuery) params.search = searchQuery;
    if (appliedFilters.status !== "All") params.status = appliedFilters.status.toLowerCase();
    
    if (appliedFilters.destination !== "All") {
      const dest = (locations as CatalogHotelLocation[]).find((l) => l.name === appliedFilters.destination);
      if (dest) params.location_id = dest.id;
    }
    
    if (appliedFilters.rating !== "All") {
      if (appliedFilters.rating !== "Unrated") {
        params.stars = parseInt(appliedFilters.rating);
      }
    }
    
    if (appliedFilters.startingFrom !== "All") {
      if (appliedFilters.startingFrom === "Under £1,000") { params.max_price = 1000; }
      else if (appliedFilters.startingFrom === "£1,000 - 2,000") { params.min_price = 1000; params.max_price = 2000; }
      else if (appliedFilters.startingFrom === "Over £2,000") { params.min_price = 2000; }
    }
    
    return params;
  }, [appliedFilters, searchQuery, locations, page, pageSize]);

  const { data: hotelsData, loading: hotelsLoading, totalCount, refetch } = useCatalogHotels(queryParams);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const filterFields = (
    [
      ["destination", "Destination", locationOptions],
      ["rating", "Rating", staticFilterOptions.rating],
      ["startingFrom", "Starting From", staticFilterOptions.startingFrom],
      ["status", "Status", staticFilterOptions.status],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options: [...options],
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  const handleConfirmAction = async () => {
    if (!confirmModal.row || !confirmModal.action) return;
    try {
      if (confirmModal.action === "Archive") {
        await archiveCatalogHotel(confirmModal.row.id);
        setBanner({ show: true, message: "The hotel has been archived successfully and is no longer visible in the active list", variant: "success" });
      } else if (confirmModal.action === "Delete") {
        await deleteCatalogHotel(confirmModal.row.id);
        setBanner({ show: true, message: "The hotel has been deleted successfully", variant: "success" });
      }
      refetch();
    } catch (err) {
      console.error(`Failed to ${confirmModal.action} hotel:`, err);
      setBanner({ show: true, message: `Failed to ${confirmModal.action.toLowerCase()} hotel.`, variant: "warning" });
    } finally {
      setConfirmModal({ open: false, action: null, row: null });
    }
  };

  const handleSelectionChange = async (rowId: string, isSelected: boolean) => {
    try {
      await updateCatalogHotel(rowId, { is_featured: isSelected });
      refetch();
    } catch (err) {
      console.error("Failed to update featured status:", err);
      setBanner({ show: true, message: "Failed to update featured status.", variant: "warning" });
    }
  };

  const hasActiveFilters = searchQuery || Object.values(appliedFilters).some(v => v !== "All");

  if (!hotelsLoading && hasActiveFilters && hotelsData.length === 0) {
    return <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />;
  }

  if (!hotelsLoading && !hasActiveFilters && hotelsData.length === 0) {
    return (
      <DashboardEmptyState
        title="No Hotels Found"
        subtitle="Catalog hotels will appear here once they are created."
        actionLabel="Add New Hotel"
        onAction={() => router.push("/dashboard/catalog/hotels/new")}
        imageSrc="/images/dashboard/empty.png"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Catalog hotels table"
      title="Hotels"
      iconSrc="/images/dashboard/catalog/trips.svg"
      showFilters
      showExport
      onExportClick={() => {}}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={hotelsData}
        columns={catalogHotelsColumns}
        getRowId={(row) => String(row.id)}
        selectable
        selectionType="star"
        selectedRowIds={(hotelsData as CatalogHotelRow[]).filter((t) => t.is_featured).map((t) => String(t.id))}
        onSelectionChange={handleSelectionChange}
        serverSidePagination={true}
        totalCount={totalCount}
        pageIndex={page - 1}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p + 1)}
        onPageSizeChange={setPageSize}
        defaultPageSize={10}
        rowActions={() =>
          catalogHotelsRowActions((action, r) => {
            if (action === "View") {
              router.push(`/dashboard/catalog/hotels/${r.id}`);
            } else if (action === "Edit") {
              router.push(`/dashboard/catalog/hotels/${r.id}/edit`);
            } else if (action === "Archive") {
              setConfirmModal({ open: true, action: "Archive", row: r });
            } else if (action === "Delete") {
              setConfirmModal({ open: true, action: "Delete", row: r });
            } else {
              console.log(`Action ${action} triggered for row`, r);
            }
          })
        }
      />
      <DashboardConfirmationModal
        open={confirmModal.open}
        variant={confirmModal.action === "Delete" ? "delete" : "activate"}
        title={confirmModal.action === "Delete" ? "Delete Hotel" : "Archive Hotel?"}
        message={
          confirmModal.action === "Delete"
            ? `Are you sure you want to delete "${confirmModal.row?.hotelName || confirmModal.row?.name || "this hotel"}"? This action cannot be undone.`
            : "The hotel will no longer be available for bookings or visible in the catalog, but you can restore it at any time."
        }
        confirmLabel={confirmModal.action === "Delete" ? "Yes, delete it" : "Archive Hotel"}
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
