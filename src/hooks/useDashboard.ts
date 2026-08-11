import useSWR from 'swr';
import { getDashboardData } from '@/services/admin/adminDashboardService';
import type { DashboardPayload } from '@/components/dashboard/DashboardHome/types';
import type { DashboardQueryParams } from '@/services/admin/adminDashboardService';

export function useAdminDashboard(range: DashboardQueryParams['range'] = 'this_month') {
  const { data, error, isLoading, mutate } = useSWR(
    ['adminDashboard', range],
    () => getDashboardData({ range })
  );

  return {
    dashboardData: data as DashboardPayload | undefined,
    isLoading,
    isError: !!error,
    refetch: mutate,
  };
}
