import { adminDataClient } from '@/lib/adminCoreApi';
import type { 
  AdminCustomer, 
  AdminCustomerStats, 
  AdminCustomerOverview,
  AdminCustomerFilters, 
  AdminCustomerListResponse,
  PaginatedTabResponse 
} from '@/types/adminCustomerTypes';

export async function getCustomers(filters?: AdminCustomerFilters): Promise<AdminCustomerListResponse> {
  const response = await adminDataClient.get('/customers/', { params: filters });
  return response as unknown as AdminCustomerListResponse;
}

export async function getCustomerStats(): Promise<AdminCustomerStats> {
  const response = await adminDataClient.get('/customers/stats/');
  return response as unknown as AdminCustomerStats;
}

export async function getCustomer(id: string): Promise<AdminCustomer> {
  const response = await adminDataClient.get(`/customers/${id}/`);
  return response as unknown as AdminCustomer;
}

export async function getCustomerOverview(id: string): Promise<AdminCustomerOverview> {
  const response = await adminDataClient.get(`/customers/${id}/overview/`);
  return response as unknown as AdminCustomerOverview;
}

export async function getCustomerBookings(id: string, page = 1): Promise<PaginatedTabResponse<any>> {
  const response = await adminDataClient.get(`/customers/${id}/bookings/`, { params: { page } });
  return response as unknown as PaginatedTabResponse<any>;
}

export async function getCustomerRequests(id: string, page = 1): Promise<PaginatedTabResponse<any>> {
  const response = await adminDataClient.get(`/customers/${id}/requests/`, { params: { page } });
  return response as unknown as PaginatedTabResponse<any>;
}

export async function getCustomerReviews(id: string, page = 1): Promise<PaginatedTabResponse<any>> {
  const response = await adminDataClient.get(`/customers/${id}/reviews/`, { params: { page } });
  return response as unknown as PaginatedTabResponse<any>;
}

export async function updateCustomer(id: string, payload: Partial<AdminCustomer>): Promise<AdminCustomer> {
  const response = await adminDataClient.patch(`/customers/${id}/`, payload);
  return response as unknown as AdminCustomer;
}

export async function blockCustomer(id: string, blocked: boolean): Promise<AdminCustomer> {
  const response = await adminDataClient.post(`/customers/${id}/block/`, { blocked });
  return response as unknown as AdminCustomer;
}
