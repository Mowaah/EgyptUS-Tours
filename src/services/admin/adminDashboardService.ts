import { adminDataClient } from '@/lib/adminCoreApi';

export interface DashboardQueryParams {
  range?: "today" | "week" | "month" | "year" | "this_week" | "this_month" | "custom";
  date_from?: string;
  date_to?: string;
}

export async function getDashboardData(params: DashboardQueryParams) {
  return await adminDataClient.get('/dashboard/', { params });
}
