import { adminDataClient } from '@/lib/adminCoreApi';

export interface DashboardQueryParams {
  range?: "today" | "week" | "month" | "this_week" | "this_month";
}

export async function getDashboardData(params: DashboardQueryParams) {
  return await adminDataClient.get('/dashboard/', { params });
}
