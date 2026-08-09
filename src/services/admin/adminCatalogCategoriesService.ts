import { adminDataClient } from '@/lib/adminCoreApi';

type QueryParams = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

const TRIP_CATEGORIES_ENDPOINT = '/catalog/trip-categories/';

export async function getCategories(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get(TRIP_CATEGORIES_ENDPOINT, { params });
}

export async function createCategory(data: { translations: Record<string, { name: string }> }): Promise<ApiResponse> {
  return await adminDataClient.post(TRIP_CATEGORIES_ENDPOINT, { ...data, name: data.translations.en?.name });
}

export async function updateCategory(id: string | number, data: { translations?: Record<string, { name: string }> }): Promise<ApiResponse> {
  return await adminDataClient.patch(`${TRIP_CATEGORIES_ENDPOINT}${id}/`, { ...data, name: data.translations?.en?.name });
}

export async function deleteCategory(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`${TRIP_CATEGORIES_ENDPOINT}${id}/`);
}
