import { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import { buildRequestFilterParams, downloadBlobAsCSV } from "@/lib/utils";
import { useDashboardDateRange } from "@/hooks/useDashboardDateRange";

interface UseRequestPanelOptions<T> {
  searchQuery: string;
  onClearSearch?: () => void;
  fetchRequestsApi: (params: any) => Promise<any>;
  exportCsvApi: (params: any) => Promise<Blob>;
  exportFilename: string;
  swrKey: string;
  page?: number;
  pageSize?: number;
}

export function useRequestPanel<T>({
  searchQuery,
  onClearSearch,
  fetchRequestsApi,
  exportCsvApi,
  exportFilename,
  swrKey,
  page = 1,
  pageSize = 10,
}: UseRequestPanelOptions<T>) {
  const dateRange = useDashboardDateRange();
  const [sourceFilter, setSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedSourceFilter, setAppliedSourceFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");

  const apiParams = useMemo(() => {
    const params = buildRequestFilterParams(searchQuery, appliedSourceFilter, appliedStatusFilter);
    params.date_from = dateRange.date_from;
    params.date_to = dateRange.date_to;
    params.page = page;
    params.page_size = pageSize;
    return params;
  }, [searchQuery, appliedSourceFilter, appliedStatusFilter, page, pageSize, dateRange]);

  const { data: res, isLoading: loading, mutate: refetch } = useSWR(
    [swrKey, apiParams],
    () => fetchRequestsApi(apiParams),
    { keepPreviousData: true }
  );

  const data = Array.isArray(res) ? res : res?.results || res?.data?.results || [];
  const totalCount = res?.count || data.length || 0;

  const handleApply = () => {
    setAppliedSourceFilter(sourceFilter);
    setAppliedStatusFilter(statusFilter);
  };

  const handleClean = () => {
    setSourceFilter("");
    setStatusFilter("");
    setAppliedSourceFilter("");
    setAppliedStatusFilter("");
    dateRange.clearDateFilter();
    onClearSearch?.();
  };

  const handleExport = async () => {
    try {
      const params = buildRequestFilterParams(searchQuery, appliedSourceFilter, appliedStatusFilter);
      params.date_from = dateRange.date_from;
      params.date_to = dateRange.date_to;
      const blob = await exportCsvApi(params);
      downloadBlobAsCSV(blob, exportFilename);
    } catch (err) {
      console.error(`Failed to export ${exportFilename}:`, err);
    }
  };

  return {
    data,
    totalCount,
    loading,
    refetch,
    sourceFilter,
    setSourceFilter,
    statusFilter,
    setStatusFilter,
    handleApply,
    handleClean,
    handleExport,
    appliedSourceFilter,
    appliedStatusFilter,
    hasDateFilter: dateRange.hasActiveFilter,
  };
}
