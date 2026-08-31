"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { useCatalogVehicles, useVehicleCategories } from "@/hooks/useCatalogVehicles";
import { archiveCatalogVehicle, deleteCatalogVehicle, updateCatalogVehicle } from "@/services/admin/adminCatalogVehiclesService";
import { transportationColumns, transportationRowActions } from "./transportationColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";

const staticFilterOptions = {
  price: ["All", "Under £1,000", "£1,000 - 2,000", "Over £2,000"],
  status: ["All", "Published", "Archived", "Draft"],
};

interface TransportationPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function TransportationPanel({ searchQuery = "", onClearSearch }: TransportationPanelProps) {
  const router = useRouter();
  
  const defaultFilters = {
    category: "All",
    price: "All",
    status: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; action: "Archive" | "Delete" | null; row: any }>({ open: false, action: null, row: null });
  const [banner, setBanner] = useState<{ show: boolean; message: string; variant: "success" | "warning" }>({ show: false, message: "", variant: "success" });
  const { categories, loading: catLoading } = useVehicleCategories();
  const categoryOptions = ["All", ...Array.from(new Set(categories.map((c: any) => c.name).filter(Boolean)))];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryParams = useMemo(() => {
    const params: any = { page, page_size: pageSize };
    if (searchQuery) params.search = searchQuery;
    if (appliedFilters.status !== "All") params.status = appliedFilters.status.toLowerCase();
    
    if (appliedFilters.category !== "All") {
      params.category = appliedFilters.category; // Adjust this if the backend filters by category_id or name
    }
    
    if (appliedFilters.price !== "All") {
      if (appliedFilters.price === "Under £1,000") { params.max_price = 1000; }
      else if (appliedFilters.price === "£1,000 - 2,000") { params.min_price = 1000; params.max_price = 2000; }
      else if (appliedFilters.price === "Over £2,000") { params.min_price = 2000; }
    }
    
    return params;
  }, [appliedFilters, searchQuery, page, pageSize]);

  const { data: vehiclesData, loading: vehiclesLoading, totalCount, refetch } = useCatalogVehicles(queryParams);

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
      ["price", "Price", staticFilterOptions.price],
      ["status", "Status", staticFilterOptions.status],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  const handleConfirmAction = async () => {
    if (!confirmModal.row || !confirmModal.action) return;
    try {
      if (confirmModal.action === "Archive") {
        await archiveCatalogVehicle(confirmModal.row.id);
        setBanner({ show: true, variant: "success", message: "The vehicle has been archived successfully and is no longer visible in the active list." });
      } else if (confirmModal.action === "Delete") {
        await deleteCatalogVehicle(confirmModal.row.id);
        setBanner({ show: true, variant: "success", message: "The vehicle has been deleted successfully." });
      }
      refetch();
    } catch (error: any) {
      setBanner({ show: true, variant: "warning", message: error.response?.data?.detail || "An error occurred." });
    } finally {
      setConfirmModal({ open: false, action: null, row: null });
    }
  };



  return (
    <TablePanel
      ariaLabel="Catalog vehicles table"
      title="Vehicles"
      iconSrc="/images/dashboard/sidebar/transportation.svg"
      showFilters
      showExport
      onExportClick={() => {}}
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={vehiclesData || []}
        columns={transportationColumns}
        getRowId={(row) => row.id}
        selectable
        selectionType="star"
        serverSidePagination={true}
        totalCount={totalCount}
        pageIndex={page - 1}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p + 1)}
        onPageSizeChange={setPageSize}
        defaultPageSize={10}
        rowActions={(row) =>
          transportationRowActions(row, (action, r) => {
            if (action === "View") {
              router.push(`/dashboard/catalog/transportation/${r.id}/overview`);
            } else if (action === "Edit") {
              router.push(`/dashboard/catalog/transportation/${r.id}/edit`);
            } else if (action === "Archive") {
              setConfirmModal({ open: true, action: "Archive", row: r });
            } else if (action === "Delete") {
              setConfirmModal({ open: true, action: "Delete", row: r });
            }
          })
        }
        isLoading={vehiclesLoading}
        onClearSearch={onClearSearch || resetFilters}
        emptyState={
          !searchQuery && Object.values(appliedFilters).every((v) => v === "All") ? (
            <DashboardEmptyState
              title="No Vehicles Found"
              subtitle="Catalog vehicles will appear here once they are created."
              actionLabel="Add New Vehicle"
              onAction={() => router.push("/dashboard/catalog/transportation/new")}
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
        title={confirmModal.action === "Delete" ? "Delete Vehicle?" : "Archive Vehicle?"}
        message={
          confirmModal.action === "Delete"
            ? "Are you sure you want to delete this Vehicle? This action cannot be undone."
            : "The vehicle will no longer be available for bookings or visible in the catalog, but you can restore it at any time."
        }
        confirmLabel={confirmModal.action === "Delete" ? "Delete Vehicle" : "Archive Vehicle"}
        cancelLabel="Cancel"
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
