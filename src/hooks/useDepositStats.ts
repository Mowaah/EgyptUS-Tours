"use client";
import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { getDepositStats } from "@/services/admin/adminFinanceService";

export function useDepositStats() {
  const { data, isLoading: loading } = useSWR(
    "adminDepositStats",
    () => getDepositStats(),
    { keepPreviousData: true }
  );

  return { data, loading };
}
