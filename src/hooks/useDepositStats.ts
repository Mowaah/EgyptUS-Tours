"use client";
import { useState, useEffect, useCallback } from "react";
import { getDepositStats } from "@/services/admin/adminFinanceService";

export function useDepositStats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDepositStats();
      setData(response);
    } catch (err) {
      console.error("Failed to fetch deposit stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading };
}
