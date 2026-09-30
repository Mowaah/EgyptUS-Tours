import useSWR from 'swr';
import { getDashboardData } from '@/services/admin/adminDashboardService';
import type { DashboardPayload } from '@/components/dashboard/DashboardHome/types';
import type { DashboardQueryParams } from '@/services/admin/adminDashboardService';

export function useAdminDashboard(range: DashboardQueryParams['range'] = 'month', dateRange?: Pick<DashboardQueryParams, 'date_from' | 'date_to'>) {
  const params = { range, ...dateRange };
  const { data, error, isLoading, mutate } = useSWR(
    ['adminDashboard', params],
    () => getDashboardData(params)
  );

  return {
    dashboardData: data as DashboardPayload | undefined,
    isLoading,
    isError: !!error,
    refetch: mutate,
  };
}
