import useSWR from "swr";

export interface RequestStats {
  total: number;
  completed: number;
  in_progress: number;
  rejected: number;
}

export function useRequestStats(fetcher: (params: any) => Promise<any>, swrKey: string) {
  const { data: res, isLoading: loading } = useSWR(
    swrKey,
    () => fetcher({ range: "30d" }),
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
