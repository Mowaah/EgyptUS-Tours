import { useState, useEffect, useCallback } from "react";
import { buildRequestFilterParams, downloadBlobAsCSV } from "@/lib/utils";

interface UseRequestPanelOptions<T> {
  searchQuery: string;
  fetchRequestsApi: (params: any) => Promise<any>;
  exportCsvApi: (params: any) => Promise<Blob>;
  exportFilename: string;
}

export function useRequestPanel<T>({
  searchQuery,
  fetchRequestsApi,
  exportCsvApi,
  exportFilename,
}: UseRequestPanelOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedSourceFilter, setAppliedSourceFilter] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildRequestFilterParams(searchQuery, appliedSourceFilter, appliedStatusFilter);
      params.page_size = 100;
      
      const results = await fetchRequestsApi(params);
      setData(results);
    } catch (err) {
      console.error(`Failed to fetch requests for ${exportFilename}:`, err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, appliedSourceFilter, appliedStatusFilter, fetchRequestsApi, exportFilename]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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
