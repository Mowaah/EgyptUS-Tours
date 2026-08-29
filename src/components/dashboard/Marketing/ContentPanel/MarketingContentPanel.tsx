"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import { DashboardConfirmationModal } from "@/components/dashboard/shared";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { useRouter, usePathname } from "next/navigation";
import { exportAdminBlogsCSV, exportAdminArticlesCSV } from "@/services/admin/adminMarketingService";
import { getMarketingColumns, useMarketingRowActions } from "./MarketingColumns";
import type { MarketingPostRow, ContentType } from "../types";
import { useMarketingPanel } from "@/hooks/useMarketingPanel";

const filterOptions = {
  category: ["All", "Destination", "Adventures", "Travel Tips", "Luxury Hotels"],
  status: ["All", "Published", "Draft", "Scheduled"],
};

interface MarketingContentPanelProps {
  contentType: ContentType;
  searchQuery?: string;
  onClearSearch?: () => void;
  fetchApi: (params: any) => Promise<any>;
  deleteApi: (id: string | number) => Promise<any>;
}

export function MarketingContentPanel({
  contentType,
  searchQuery = "",
  onClearSearch,
  fetchApi,
  deleteApi,
}: MarketingContentPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data,
    loading,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    handleApply,
    handleClean,
    handleExport,
    refetch,
    totalCount,
  } = useMarketingPanel<MarketingPostRow>({
    contentType,
    searchQuery,
    page,
    pageSize,
    fetchApi,
    exportCsvApi: contentType === "articles" ? exportAdminArticlesCSV : exportAdminBlogsCSV,
    exportFilename: `${contentType}_export.csv`,
    swrKey: `adminMarketingPosts_${contentType}`,
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<MarketingPostRow | null>(null);

  const handleDeleteRow = (row: MarketingPostRow) => {
    setPostToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const rowActions = useMarketingRowActions(contentType, handleDeleteRow);

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      try {
        await deleteApi(postToDelete.id || postToDelete.postId);
        setIsDeleteModalOpen(false);
        setPostToDelete(null);
        refetch();
        router.push(`${pathname}?deleted=true`);
      } catch (e) {
        console.error("Failed to delete post:", e);
      }
    }
  };

  const resetFilters = () => {
    handleClean();
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const filterFields = [
    {
      id: "category",
      label: "Category",
      value: categoryFilter || "All",
      options: filterOptions.category,
      onChange: (value: string) => setCategoryFilter(value),
    },
    {
      id: "status",
      label: "Status",
      value: statusFilter || "All",
      options: filterOptions.status,
      onChange: (value: string) => setStatusFilter(value),
    },
  ];

  const itemName = contentType === "articles" ? "Article" : "Blog Post";
  const pluralName = contentType === "articles" ? "Articles" : "Blog Posts";



  return (
    <>
      <TablePanel 
        ariaLabel={`${pluralName} list`}
        title={pluralName}
        iconSrc={`/images/dashboard/sidebar/${contentType === "articles" ? "articles" : "blog"}.svg`}
        showFilters
        showExport
        onExportClick={handleExport}
        toolbar={
          <TablePanelFilterBar
            fields={filterFields}
            onApply={handleApply}
            onClean={resetFilters}
          />
        }
      >
        <DataTable<MarketingPostRow>
          columns={getMarketingColumns()}
          data={data}
          getRowId={(row) => String(row.id ?? row.postId)}
          rowActions={rowActions}
          serverSidePagination={true}
          totalCount={totalCount}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPageChange={(p) => setPage(p + 1)}
          onPageSizeChange={setPageSize}
          defaultPageSize={10}
          isLoading={loading}
          onClearSearch={resetFilters}
          emptyState={
            !searchQuery && !categoryFilter && !statusFilter ? (
              <DashboardEmptyState
                title={`No ${pluralName} Yet`}
                subtitle={`There are no ${pluralName.toLowerCase()} available at the moment.`}
                actionLabel={`Create Your First ${itemName}`}
                onAction={() => router.push(`/dashboard/marketing/${contentType}/create`)}
                imageSrc="/images/dashboard/empty.png"
              />
            ) : !searchQuery && (categoryFilter || statusFilter) ? (
              <DashboardFilterEmptyState
                onClearFilters={resetFilters}
                title="No Results Found"
                subtitle="No results match the selected filters."
              />
            ) : undefined
          }
        />
      </TablePanel>

      <DashboardConfirmationModal
        open={isDeleteModalOpen}
        title={`Delete ${itemName}`}
        message={`Are you sure you want to delete this ${itemName.toLowerCase()}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        variant="delete"
      />
    </>
  );
}
