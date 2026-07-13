"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { mockCatalogTransportation } from "../mockCatalogTransportation";
import { transportationColumns, transportationRowActions } from "./transportationColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";

const filterOptions = {
  category: ["All", "Sedan", "Van", "Bus"],
  price: ["All", "Under $1000", "$1000 - $2000", "Over $2000"],
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
  const [vehiclesData, setVehiclesData] = useState(mockCatalogTransportation);

  const [confirmModal, setConfirmModal] = useState<{ open: boolean; action: "Archive" | "Delete" | null; row: any }>({ open: false, action: null, row: null });
  const [banner, setBanner] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const filteredVehicles = useMemo(
    () =>
      vehiclesData.filter((vehicle) => {
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (
            !vehicle.id.toLowerCase().includes(lowerQuery) &&
            !vehicle.name.toLowerCase().includes(lowerQuery)
          ) {
            return false;
          }
        }
        if (appliedFilters.category !== "All" && vehicle.category !== appliedFilters.category) return false;
        // Basic price filtering implementation (could be enhanced based on string parsing)
        if (appliedFilters.status !== "All" && vehicle.status !== appliedFilters.status) return false;
        return true;
      }),
    [appliedFilters, searchQuery, vehiclesData]
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
      ["category", "Category", filterOptions.category],
      ["price", "Price", filterOptions.price],
      ["status", "Status", filterOptions.status],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  if (mockCatalogTransportation.length > 0 && filteredVehicles.length === 0) {
    return <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />;
  }

  if (mockCatalogTransportation.length === 0) {
    return (
      <DashboardEmptyState
        title="No Vehicles Found"
        subtitle="Catalog vehicles will appear here once they are created."
        actionLabel="Add New Vehicle"
        onAction={() => router.push("/dashboard/catalog/transportation/new")}
        imageSrc="/images/dashboard/empty-folder.svg"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Catalog vehicles table"
      title="Vehicles"
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
        data={filteredVehicles}
        columns={transportationColumns}
        getRowId={(row) => row.id}
        selectable
        selectionType="star"
        rowActions={(row) =>
          transportationRowActions((action, r) => {
            if (action === "View") {
              router.push(`/dashboard/catalog/transportation/${r.id}`);
            } else if (action === "Edit") {
              router.push(`/dashboard/catalog/transportation/${r.id}/edit`);
            } else if (action === "Archive") {
              setConfirmModal({ open: true, action: "Archive", row: r });
            } else if (action === "Delete") {
              setConfirmModal({ open: true, action: "Delete", row: r });
            } else {
              console.log(`Action ${action} triggered for row`, r);
            }
          })
        }
        defaultPageSize={10}
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
        onConfirm={() => {
          if (confirmModal.action === "Archive") {
            setVehiclesData(prev => prev.map(h => h.id === confirmModal.row?.id ? { ...h, status: "Archived" } : h));
            setBanner({ show: true, message: "The vehicle has been archived successfully and is no longer visible in the active list" });
          } else if (confirmModal.action === "Delete") {
            setVehiclesData(prev => prev.filter(h => h.id !== confirmModal.row?.id));
            setBanner({ show: true, message: "The vehicle has been deleted successfully" });
          }
          setConfirmModal({ open: false, action: null, row: null });
        }}
      />
      <DashboardStatusBanner
        show={banner.show}
        variant="success"
        message={banner.message}
        onClose={() => setBanner({ show: false, message: "" })}
      />
    </TablePanel>
  );
}
