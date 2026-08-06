import { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import { buildRequestFilterParams, downloadBlobAsCSV } from "@/lib/utils";

interface UseRequestPanelOptions<T> {
  searchQuery: string;
  fetchRequestsApi: (params: any) => Promise<any>;
  exportCsvApi: (params: any) => Promise<Blob>;
  exportFilename: string;
  swrKey: string;
}

export function useRequestPanel<T>({
  searchQuery,
  fetchRequestsApi,
  exportCsvApi,
  exportFilename,
  swrKey,
}: UseRequestPanelOptions<T>) {
  const [sourceFilter, setSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedSourceFilter, setAppliedSourceFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");

  const apiParams = useMemo(() => {
    const params = buildRequestFilterParams(searchQuery, appliedSourceFilter, appliedStatusFilter);
    params.page_size = 1000;
    params.limit = 1000;
    return params;
  }, [searchQuery, appliedSourceFilter, appliedStatusFilter]);

  const { data: res, isLoading: loading, mutate: refetch } = useSWR(
    [swrKey, apiParams],
    () => fetchRequestsApi(apiParams),
    { keepPreviousData: true }
  );

  const data = Array.isArray(res) ? res : res?.results || res?.data?.results || [];

  const handleApply = () => {
    setAppliedSourceFilter(sourceFilter);
    setAppliedStatusFilter(statusFilter);
  };

  const handleClean = () => {
    setSourceFilter("");
    setStatusFilter("");
    setAppliedSourceFilter("");
    setAppliedStatusFilter("");
  };

  const handleExport = async () => {
    try {
      const params = buildRequestFilterParams(searchQuery, appliedSourceFilter, appliedStatusFilter);
      const blob = await exportCsvApi(params);
      downloadBlobAsCSV(blob, exportFilename);
    } catch (err) {
      console.error(`Failed to export ${exportFilename}:`, err);
    }
  };

  return {
    data,
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
  };
}
