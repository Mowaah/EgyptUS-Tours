import { useState, useCallback, useEffect } from "react";
import { ContentType } from "@/components/dashboard/Marketing/types";
import { downloadBlobAsCSV } from "@/lib/utils";

export interface UseMarketingPanelParams<T> {
  contentType: ContentType;
  searchQuery: string;
  fetchApi: (params: any) => Promise<any>;
  exportCsvApi?: (params: any) => Promise<Blob>;
  exportFilename?: string;
}

export function useMarketingPanel<T>({
  contentType,
  searchQuery,
  fetchApi,
  exportCsvApi,
  exportFilename = "marketing_export.csv",
}: UseMarketingPanelParams<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [publishDateFilter, setPublishDateFilter] = useState("");

  const [appliedCategoryFilter, setAppliedCategoryFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");
  const [appliedPublishDateFilter, setAppliedPublishDateFilter] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page_size: 100 };
      if (searchQuery) params.search = searchQuery;
      if (appliedCategoryFilter && appliedCategoryFilter !== "All") params.category = appliedCategoryFilter.toLowerCase().replace(/\s+/g, '-');
      if (appliedStatusFilter && appliedStatusFilter !== "All") params.status = appliedStatusFilter.toLowerCase();
      if (appliedPublishDateFilter && appliedPublishDateFilter !== "All") params.date = appliedPublishDateFilter;

      const response = await fetchApi(params);
      
      // Handle both paginated and direct array responses
      const results = response?.results || response || [];
      setData(results);
    } catch (error) {
      console.error(`Failed to fetch ${contentType}:`, error);
    } finally {
      setLoading(false);
    }
  }, [contentType, searchQuery, appliedCategoryFilter, appliedStatusFilter, appliedPublishDateFilter, fetchApi]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleApply = () => {
    setAppliedCategoryFilter(categoryFilter);
    setAppliedStatusFilter(statusFilter);
    setAppliedPublishDateFilter(publishDateFilter);
  };

  const handleClean = () => {
    setCategoryFilter("");
    setStatusFilter("");
    setPublishDateFilter("");
    setAppliedCategoryFilter("");
    setAppliedStatusFilter("");
    setAppliedPublishDateFilter("");
  };

  const handleExport = async () => {
    if (!exportCsvApi) return;
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (appliedCategoryFilter && appliedCategoryFilter !== "All") params.category = appliedCategoryFilter.toLowerCase().replace(/\s+/g, '-');
      if (appliedStatusFilter && appliedStatusFilter !== "All") params.status = appliedStatusFilter.toLowerCase();
      if (appliedPublishDateFilter && appliedPublishDateFilter !== "All") params.date = appliedPublishDateFilter;

      const blob = await exportCsvApi(params);
      downloadBlobAsCSV(blob, exportFilename);
    } catch (error) {
      console.error(`Failed to export ${exportFilename}:`, error);
    }
  };

  return {
    data,
    loading,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    publishDateFilter,
    setPublishDateFilter,
    handleApply,
    handleClean,
    handleExport,
    appliedCategoryFilter,
    appliedStatusFilter,
    appliedPublishDateFilter,
    refetch: fetchPosts,
  };
}
