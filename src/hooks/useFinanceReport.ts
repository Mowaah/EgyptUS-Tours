import { useState, useEffect, useCallback } from "react";
import { getFinanceReport } from "@/services/admin/adminFinanceService";

export function useFinanceReport(range: string = "ytd") {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFinanceReport({ range });
      setData(response);
    } catch (err) {
      console.error("Failed to fetch finance report:", err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { data, loading };
}
