"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { mockBlogs } from "./blogsData";
import { blogsColumns, blogRowActions } from "./blogsColumns";

const filterOptions = {
  category: ["All", "Destination", "Adventures", "Travel Tips"],
  publishDate: ["All", "Mar 15, 2024"],
  status: ["All", "Published", "Draft", "Scheduled"],
};

export function BlogsPanel() {
  const defaultFilters = {
    category: "All",
    publishDate: "All",
    status: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const filteredBlogs = useMemo(
    () =>
      mockBlogs.filter((blog) => {
        if (appliedFilters.category !== "All" && blog.category !== appliedFilters.category) return false;
        if (appliedFilters.publishDate !== "All" && blog.publishDate !== appliedFilters.publishDate) return false;
        if (appliedFilters.status !== "All" && blog.status !== appliedFilters.status) return false;
        return true;
      }),
    [appliedFilters]
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
      ["publishDate", "Publish Date", filterOptions.publishDate],
      ["status", "Status", filterOptions.status],
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
      ariaLabel="Blogs table"
      title="Blogs"
      iconSrc="/images/dashboard/sidebar/blog.svg"
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
        data={filteredBlogs}
        columns={blogsColumns}
        getRowId={(row) => row.id}
        selectable
        rowActions={blogRowActions}
        defaultPageSize={16}
      />
    </TablePanel>
  );
}
