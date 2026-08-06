import { adminDataClient } from '@/lib/adminCoreApi';
import { apiClient as publicDataClient } from '@/lib/api';

type QueryParams = Record<string, unknown>;
type CatalogVehiclePayload = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

export async function getCatalogVehicles(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/vehicles/', { params });
}

export async function getCatalogVehicleDetail(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.get(`/catalog/vehicles/${id}/`);
}

export async function createCatalogVehicle(payload: CatalogVehiclePayload): Promise<ApiResponse> {
  return await adminDataClient.post('/catalog/vehicles/', payload);
}

export async function updateCatalogVehicle(id: string | number, payload: CatalogVehiclePayload): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/vehicles/${id}/`, payload);
}

export async function archiveCatalogVehicle(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.post(`/catalog/vehicles/${id}/archive/`);
}

export async function publishCatalogVehicle(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.post(`/catalog/vehicles/${id}/publish/`);
}

export async function unpublishCatalogVehicle(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.post(`/catalog/vehicles/${id}/unpublish/`);
}

export async function deleteCatalogVehicle(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`/catalog/vehicles/${id}/`);
}

export interface VehicleSeoPayload {
  translations: {
    en: {
      meta_title?: string;
      meta_description?: string;
      meta_keywords?: string[];
      slug?: string;
      name?: string;
    };
  };
}

export async function updateVehicleSeo(id: string | number, payload: VehicleSeoPayload): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/vehicles/${id}/seo/`, payload);
}

export async function getVehicleCategories(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/vehicle-categories/', { params });
}
