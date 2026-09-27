import { adminDataClient, BASE_URL } from '@/lib/adminCoreApi';
import Cookies from 'js-cookie';

export interface RoutePriceItem {
  category_id: number;
  category_name?: string;
  price: string | null;
}

export interface VehicleRouteItem {
  id: number;
  route_code: string;
  from_location: string;
  to_location: string;
  prices: RoutePriceItem[];
  translations?: {
    en?: { from_location: string; to_location: string };
    it?: { from_location: string; to_location: string };
    es?: { from_location: string; to_location: string };
  };
}

export interface VehicleRoutesPaginatedResponse {
  count: number;
  results: VehicleRouteItem[];
  next: string | null;
  previous: string | null;
}

export interface RouteMutationPayload {
  translations?: {
    en?: { from_location: string; to_location: string };
    it?: { from_location: string; to_location: string };
    es?: { from_location: string; to_location: string };
  };
  prices?: { category_id: number; price: string | null }[];
}

export async function getVehicleRoutes(params?: {
  search?: string;
  lang?: string;
  page?: number;
  page_size?: number;
}): Promise<VehicleRoutesPaginatedResponse> {
  return await adminDataClient.get('/catalog/vehicle-routes/', { params });
}

export async function createVehicleRoute(payload: RouteMutationPayload): Promise<VehicleRouteItem> {
  return await adminDataClient.post('/catalog/vehicle-routes/', payload);
}

export async function updateVehicleRoute(
  id: string | number,
  payload: RouteMutationPayload
): Promise<VehicleRouteItem> {
  return await adminDataClient.patch(`/catalog/vehicle-routes/${id}/`, payload);
}

export async function deleteVehicleRoute(id: string | number): Promise<void> {
  return await adminDataClient.delete(`/catalog/vehicle-routes/${id}/`);
}

export async function exportVehicleRoutesCsv(): Promise<void> {
  const token = Cookies.get('admin_access_token');
  const response = await fetch(`${BASE_URL}/api/v1/admin/catalog/vehicle-routes/export/`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to export routes CSV');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vehicle-routes-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
