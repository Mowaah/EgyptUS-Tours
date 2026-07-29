import { useState, useEffect } from "react";

export interface RequestStats {
  total: number;
  completed: number;
  in_progress: number;
  rejected: number;
}

export function useRequestStats(fetcher: (params: any) => Promise<any>) {
  const [stats, setStats] = useState<RequestStats>({
    total: 0,
    completed: 0,
    in_progress: 0,
    rejected: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await fetcher({ range: "30d" });
        setStats({
          total: data.total || 0,
          completed: data.completed || 0,
          in_progress: data.in_progress || 0,
          rejected: data.rejected || 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }
    fetchStats();
  }, [fetcher]);

  return stats;
}
