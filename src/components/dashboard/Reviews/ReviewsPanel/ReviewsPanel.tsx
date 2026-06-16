"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { mockReviews } from "../reviewsData";
import { reviewsColumns, reviewRowActions } from "./reviewsColumns";

const filterOptions = {
  category: ["All", "Trips", "Transportation", "Hotels"],
  rating: ["All", "5 stars", "4 stars", "3 stars", "2 stars", "1 star"],
  state: ["All", "Pending", "Replied"],
  date: ["All", "Mar 15, 2024", "Mar 14, 2024"],
};

interface ReviewsPanelProps {
  searchQuery?: string;
}

export function ReviewsPanel({ searchQuery = "" }: ReviewsPanelProps) {
  const defaultFilters = {
    category: "All",
    rating: "All",
    state: "All",
    date: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const filteredReviews = useMemo(
    () =>
      mockReviews.filter((review) => {
        if (
          searchQuery &&
          !review.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !review.id.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        if (appliedFilters.category !== "All" && review.category !== appliedFilters.category) return false;
        if (appliedFilters.rating !== "All") {
          const ratingNum = parseInt(appliedFilters.rating);
          if (review.rating !== ratingNum) return false;
        }
        if (appliedFilters.state !== "All" && review.status !== appliedFilters.state) return false;
        if (appliedFilters.date !== "All" && review.date !== appliedFilters.date) return false;
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
      ["rating", "Rating", filterOptions.rating],
      ["state", "State", filterOptions.state],
      ["date", "Date", filterOptions.date],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  return (
    <TablePanel
      ariaLabel="User reviews table"
      title="User Reviews"
      iconSrc="/images/dashboard/sidebar/reviews.svg"
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
        data={filteredReviews}
        columns={reviewsColumns}
        getRowId={(row) => row.id}
        selectable
        rowActions={reviewRowActions}
        defaultPageSize={5}
      />
    </TablePanel>
  );
}
