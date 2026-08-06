import { adminDataClient } from '@/lib/adminCoreApi';

type QueryParams = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

export async function getVehicleCategories(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/vehicle-categories/', { params });
}

export async function getVehicleCategoryDetail(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.get(`/catalog/vehicle-categories/${id}/`);
}

export async function createVehicleCategory(payload: Record<string, unknown>): Promise<ApiResponse> {
  return await adminDataClient.post('/catalog/vehicle-categories/', payload);
}

export async function updateVehicleCategory(id: string | number, payload: Record<string, unknown>): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/vehicle-categories/${id}/`, payload);
}

export async function deleteVehicleCategory(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`/catalog/vehicle-categories/${id}/`);
}
