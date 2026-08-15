import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import { ContentType } from "@/components/dashboard/Marketing/types";
import { downloadBlobAsCSV } from "@/lib/utils";

export interface UseMarketingPanelParams<T> {
  contentType: ContentType;
  searchQuery: string;
  fetchApi: (params: any) => Promise<any>;
  exportCsvApi?: (params: any) => Promise<Blob>;
  exportFilename?: string;
  swrKey: string;
  page?: number;
  pageSize?: number;
}

export function useMarketingPanel<T>({
  contentType,
  searchQuery,
  fetchApi,
  exportCsvApi,
  exportFilename = "marketing_export.csv",
  swrKey,
  page = 1,
  pageSize = 10,
}: UseMarketingPanelParams<T>) {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [publishDateFilter, setPublishDateFilter] = useState("");

  const [appliedCategoryFilter, setAppliedCategoryFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");
  const [appliedPublishDateFilter, setAppliedPublishDateFilter] = useState("");

  const apiParams = useMemo(() => {
    const params: any = { page, page_size: pageSize };
    if (searchQuery) params.search = searchQuery;
    if (appliedCategoryFilter && appliedCategoryFilter !== "All") params.category = appliedCategoryFilter.toLowerCase().replace(/\s+/g, '-');
    if (appliedStatusFilter && appliedStatusFilter !== "All") params.status = appliedStatusFilter.toLowerCase();
    if (appliedPublishDateFilter && appliedPublishDateFilter !== "All") params.date = appliedPublishDateFilter;
    return params;
  }, [searchQuery, appliedCategoryFilter, appliedStatusFilter, appliedPublishDateFilter, page, pageSize]);

  const { data: res, isLoading: loading, mutate: refetch } = useSWR(
    [swrKey, apiParams],
    () => fetchApi(apiParams),
    { keepPreviousData: true }
  );

  const data = Array.isArray(res) ? res : res?.results || res?.data?.results || [];
  const totalCount = res?.count || data.length || 0;

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
    totalCount,
    loading,
    refetch,
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
  };
}
