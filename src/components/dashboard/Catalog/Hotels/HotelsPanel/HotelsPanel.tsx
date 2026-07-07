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

  const filteredHotels = useMemo(
    () =>
      mockCatalogHotels.filter((hotel) => {
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
