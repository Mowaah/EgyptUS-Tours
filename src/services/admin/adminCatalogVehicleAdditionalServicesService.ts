import { adminDataClient } from '@/lib/adminCoreApi';

type QueryParams = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

export async function getVehicleAdditionalServices(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/vehicle-additional-services/', { params });
}

export async function getVehicleAdditionalServiceDetail(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.get(`/catalog/vehicle-additional-services/${id}/`);
}

export async function createVehicleAdditionalService(payload: Record<string, unknown>): Promise<ApiResponse> {
  return await adminDataClient.post('/catalog/vehicle-additional-services/', payload);
}

export async function updateVehicleAdditionalService(id: string | number, payload: Record<string, unknown>): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/vehicle-additional-services/${id}/`, payload);
}

export async function deleteVehicleAdditionalService(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`/catalog/vehicle-additional-services/${id}/`);
}
