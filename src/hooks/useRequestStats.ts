import useSWR from "swr";
import { useDashboardDateRange } from "@/hooks/useDashboardDateRange";

export interface RequestStats {
  total: number;
  completed: number;
  in_progress: number;
  rejected: number;
}

export function useRequestStats(fetcher: (params: any) => Promise<any>, swrKey: string) {
  const dateRange = useDashboardDateRange();
  const { date_from, date_to } = dateRange;
  const { data: res, isLoading: loading } = useSWR(
    [swrKey, date_from, date_to],
    () => fetcher({ range: "30d", date_from, date_to }),
    { keepPreviousData: true }
  );

  const stats = {
    total: res?.total || 0,
    completed: res?.completed || 0,
    in_progress: res?.in_progress || 0,
    rejected: res?.rejected || 0,
  };

  return { stats, loading };
}
