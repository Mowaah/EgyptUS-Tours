"use client";
import useSWR from "swr";
import { getPaymentStats } from "@/services/admin/adminFinanceService";

export interface PaymentStatsData {
  total_payments_mtd?: string;
  total_transactions?: number;
  refunded_amount?: string;
  revenue_growth_pct?: string;
  revenue_by_destination?: Array<{ destination: string; total_revenue: string }>;
  revenue_by_category?: Record<string, string>;
}

export function usePaymentStats(params?: any) {
  const { data, isLoading: loading, mutate } = useSWR<PaymentStatsData>(
    ["adminPaymentStats", params],
    () => getPaymentStats(params),
    { keepPreviousData: true }
  );

  return { data, loading, refetch: mutate };
}
