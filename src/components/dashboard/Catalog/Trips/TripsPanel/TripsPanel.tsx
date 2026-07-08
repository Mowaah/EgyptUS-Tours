"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { mockCatalogTrips } from "../mockCatalogTrips";
import { catalogTripsColumns, catalogTripsRowActions } from "./catalogTripsColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";

const filterOptions = {
  category: ["All", "Multi Country Tours", "Honeymoon", "Family", "Adventure"],
  destination: ["All", "Cairo", "Luxor", "Aswan", "Alexandria"],
  duration: ["All", "1-3 Days", "4-7 Days", "8-14 Days", "15+ Days"],
  startingFrom: ["All", "Under $1000", "$1000 - $2000", "Over $2000"],
  status: ["All", "Published", "Archived", "Draft"],
};

interface TripsPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function TripsPanel({ searchQuery = "", onClearSearch }: TripsPanelProps) {
  const router = useRouter();
  
  const defaultFilters = {
    category: "All",
    destination: "All",
    duration: "All",
    startingFrom: "All",
    status: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [tripsData, setTripsData] = useState(mockCatalogTrips);
  
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; action: "Archive" | "Delete" | null; row: any }>({ open: false, action: null, row: null });
  const [banner, setBanner] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const filteredTrips = useMemo(
    () =>
      tripsData.filter((trip) => {
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (
            !trip.id.toLowerCase().includes(lowerQuery) &&
            !trip.tripName.toLowerCase().includes(lowerQuery)
          ) {
            return false;
          }
        }
        if (appliedFilters.category !== "All" && trip.category !== appliedFilters.category) return false;
        if (appliedFilters.destination !== "All" && trip.destination !== appliedFilters.destination) return false;
        if (appliedFilters.status !== "All" && trip.status !== appliedFilters.status) return false;
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
      ["category", "Category", filterOptions.category],
      ["destination", "Destination", filterOptions.destination],
      ["duration", "Duration", filterOptions.duration],
      ["startingFrom", "Starting From", filterOptions.startingFrom],
      ["status", "Status", filterOptions.status],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  if (mockCatalogTrips.length > 0 && filteredTrips.length === 0) {
    return <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />;
  }

  if (mockCatalogTrips.length === 0) {
    return (
      <DashboardEmptyState
        title="No Trips Found"
        subtitle="Catalog trips will appear here once they are created."
        actionLabel="Add New Trip"
        onAction={() => {}}
        imageSrc="/images/dashboard/empty-folder.svg"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Catalog trips table"
      title="Trips Packages"
      iconSrc="/images/dashboard/catalog/trips.svg"
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
        columns={catalogTripsColumns}
        getRowId={(row) => row.id}
        selectable
        selectionType="star"
        rowActions={(row) =>
          catalogTripsRowActions((action, r) => {
            if (action === "View") {
              router.push(`/dashboard/catalog/trips/${r.id}`);
            } else if (action === "Edit") {
              router.push(`/dashboard/catalog/trips/${r.id}/edit`);
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
        title={confirmModal.action === "Delete" ? "Delete Trip" : "Archive Trip?"}
        message={
          confirmModal.action === "Delete"
            ? `Are you sure you want to delete "${confirmModal.row?.tripName}"? This action cannot be undone.`
            : "The trip will no longer be available for bookings or visible in the catalog, but you can restore it at any time."
        }
        confirmLabel={confirmModal.action === "Delete" ? "Yes, delete it" : "Archive Trip"}
        cancelLabel={confirmModal.action === "Delete" ? "Keep it" : "Cancel"}
        onClose={() => setConfirmModal({ open: false, action: null, row: null })}
        onConfirm={() => {
          if (confirmModal.action === "Archive") {
            setTripsData(prev => prev.map(t => t.id === confirmModal.row?.id ? { ...t, status: "Archived" } : t));
            setBanner({ show: true, message: "The trip has been archived successfully and is no longer visible in the active trips list" });
          } else if (confirmModal.action === "Delete") {
            setTripsData(prev => prev.filter(t => t.id !== confirmModal.row?.id));
            setBanner({ show: true, message: "The trip has been deleted successfully" });
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
