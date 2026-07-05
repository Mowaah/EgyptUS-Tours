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

  const filteredTrips = useMemo(
    () =>
      mockCatalogTrips.filter((trip) => {
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
      iconSrc="/images/dashboard/sidebar/trips.svg"
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
            } else {
              console.log(`Action ${action} triggered for row`, r);
            }
          })
        }
        defaultPageSize={10}
      />
    </TablePanel>
  );
}
