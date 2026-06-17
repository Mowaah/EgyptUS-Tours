"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
  TablePanelHeaderButton,
} from "@/components/dashboard/TablePanel";
import { DashboardConfirmationModal } from "@/components/shared";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { useRouter } from "next/navigation";
import { mockArticles } from "./articlesData";
import { articlesColumns, useArticleRowActions } from "./articlesColumns";
import type { ArticleRow } from "../types";

const filterOptions = {
  category: ["All", "Destination", "Adventures", "Travel Tips"],
  publishDate: ["All", "Mar 15, 2024"],
  status: ["All", "Published", "Draft", "Scheduled"],
};

interface ArticlesPanelProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function ArticlesPanel({ searchQuery = "", onClearSearch }: ArticlesPanelProps) {
  const defaultFilters = {
    category: "All",
    publishDate: "All",
    status: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<ArticleRow | null>(null);
  const router = useRouter();

  const handleDeleteRow = (row: ArticleRow) => {
    setArticleToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const rowActions = useArticleRowActions(handleDeleteRow);

  const filteredArticles = useMemo(
    () =>
      mockArticles.filter((article) => {
        if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (appliedFilters.category !== "All" && article.category !== appliedFilters.category) return false;
        if (appliedFilters.publishDate !== "All" && article.publishDate !== appliedFilters.publishDate) return false;
        if (appliedFilters.status !== "All" && article.status !== appliedFilters.status) return false;
        return true;
      }),
    [appliedFilters, searchQuery]
  );

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    if (onClearSearch) {
      onClearSearch();
    }
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

  if (mockArticles.length > 0 && filteredArticles.length === 0) {
    return (
      <DashboardSearchEmptyState onClearSearch={resetFilters} />
    );
  }

  if (mockArticles.length === 0) {
    return (
      <DashboardEmptyState
        title="No Articles Yet"
        subtitle="There are no article posts available at the moment."
        actionLabel="Create Your First Article"
        onAction={() => router.push("/dashboard/marketing/articles/create")}
      />
    );
  }

  return (
    <TablePanel
      ariaLabel="Articles table"
      title="Articles"
      iconSrc="/images/dashboard/sidebar/articles.svg"
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
        data={filteredArticles}
        columns={articlesColumns}
        getRowId={(row) => row.id}
        selectable
        rowActions={rowActions}
        defaultPageSize={16}
      />

      <DashboardConfirmationModal
        open={isDeleteModalOpen}
        variant="delete"
        title="Delete Article"
        message="Are you sure you want to delete this Article? This action cannot be undone and the article will be permanently removed from the system."
        cancelLabel="Back"
        confirmLabel="Delete"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          router.push("/dashboard/marketing/articles?deleted=true");
        }}
      />
    </TablePanel>
  );
}
