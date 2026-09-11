"use client";
import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { getDepositStats } from "@/services/admin/adminFinanceService";

export function useDepositStats(params?: any) {
  const { data, isLoading: loading } = useSWR(
    ["adminDepositStats", params],
    () => getDepositStats(params),
    { keepPreviousData: true }
  );

  return { data, loading };
}
