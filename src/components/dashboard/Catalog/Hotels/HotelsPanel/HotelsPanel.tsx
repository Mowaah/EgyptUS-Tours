"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { mockCatalogHotels } from "../mockCatalogHotels";
import { catalogHotelsColumns, catalogHotelsRowActions } from "./catalogHotelsColumns";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";

const filterOptions = {
  destination: ["All", "Cairo", "Luxor", "Aswan", "Alexandria"],
  rating: ["All", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star", "Unrated"],
  startingFrom: ["All", "Under $1000", "$1000 - $2000", "Over $2000"],
  status: ["All", "Published", "Archived", "Draft"],
};

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
  const [hotelsData, setHotelsData] = useState(mockCatalogHotels);

  const [confirmModal, setConfirmModal] = useState<{ open: boolean; action: "Archive" | "Delete" | null; row: any }>({ open: false, action: null, row: null });
  const [banner, setBanner] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const filteredHotels = useMemo(
    () =>
      hotelsData.filter((hotel) => {
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (
            !hotel.id.toLowerCase().includes(lowerQuery) &&
            !hotel.hotelName.toLowerCase().includes(lowerQuery)
          ) {
            return false;
          }
        }
        if (appliedFilters.destination !== "All" && hotel.destination !== appliedFilters.destination) return false;
        if (appliedFilters.rating !== "All" && hotel.rating !== appliedFilters.rating) return false;
        if (appliedFilters.status !== "All" && hotel.status !== appliedFilters.status) return false;
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
      ["destination", "Destination", filterOptions.destination],
      ["rating", "Rating", filterOptions.rating],
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

  if (mockCatalogHotels.length > 0 && filteredHotels.length === 0) {
    return <DashboardSearchEmptyState onClearSearch={onClearSearch || resetFilters} />;
  }

  if (mockCatalogHotels.length === 0) {
    return (
      <DashboardEmptyState
        title="No Hotels Found"
        subtitle="Catalog hotels will appear here once they are created."
        actionLabel="Add New Hotel"
        onAction={() => router.push("/dashboard/catalog/hotels/new")}
        imageSrc="/images/dashboard/empty-folder.svg"
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Catalog hotels table"
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
        data={filteredHotels}
        columns={catalogHotelsColumns}
        getRowId={(row) => row.id}
        selectable
        selectionType="star"
        rowActions={(row) =>
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
        defaultPageSize={10}
      />
      <DashboardConfirmationModal
        open={confirmModal.open}
        variant={confirmModal.action === "Delete" ? "delete" : "activate"}
        title={confirmModal.action === "Delete" ? "Delete Hotel" : "Archive Hotel?"}
        message={
          confirmModal.action === "Delete"
            ? `Are you sure you want to delete "${confirmModal.row?.hotelName}"? This action cannot be undone.`
            : "The hotel will no longer be available for bookings or visible in the catalog, but you can restore it at any time."
        }
        confirmLabel={confirmModal.action === "Delete" ? "Yes, delete it" : "Archive Hotel"}
        cancelLabel={confirmModal.action === "Delete" ? "Keep it" : "Cancel"}
        onClose={() => setConfirmModal({ open: false, action: null, row: null })}
        onConfirm={() => {
          if (confirmModal.action === "Archive") {
            setHotelsData(prev => prev.map(h => h.id === confirmModal.row?.id ? { ...h, status: "Archived" } : h));
            setBanner({ show: true, message: "The hotel has been archived successfully and is no longer visible in the active hotels list" });
          } else if (confirmModal.action === "Delete") {
            setHotelsData(prev => prev.filter(h => h.id !== confirmModal.row?.id));
            setBanner({ show: true, message: "The hotel has been deleted successfully" });
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
