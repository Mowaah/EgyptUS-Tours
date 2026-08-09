import { adminDataClient } from '@/lib/adminCoreApi';

type QueryParams = Record<string, unknown>;
type CatalogHotelPayload = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

export async function getCatalogHotels(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/hotels/', { params });
}

export async function getCatalogHotelDetail(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.get(`/catalog/hotels/${id}/`);
}

export async function createCatalogHotel(payload: CatalogHotelPayload): Promise<ApiResponse> {
  return await adminDataClient.post('/catalog/hotels/', payload);
}

export async function updateCatalogHotel(id: string | number, payload: CatalogHotelPayload): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/hotels/${id}/`, payload);
}

export async function archiveCatalogHotel(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.post(`/catalog/hotels/${id}/archive/`);
}

export async function publishCatalogHotel(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.post(`/catalog/hotels/${id}/publish/`);
}

export async function unpublishCatalogHotel(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.post(`/catalog/hotels/${id}/unpublish/`);
}

export async function deleteCatalogHotel(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`/catalog/hotels/${id}/`);
}

export interface HotelSeoPayload {
  translations: {
    en: {
      meta_title?: string;
      meta_description?: string;
      meta_keywords?: string[];
      slug?: string;
      title?: string;
    };
  };
}

export async function updateHotelSeo(id: string | number, payload: HotelSeoPayload): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/hotels/${id}/seo/`, payload);
}

export async function getCatalogHotelLocations(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/hotel-locations/', { params });
}

export async function createCatalogHotelLocation(payload: Record<string, unknown>): Promise<ApiResponse> {
  return await adminDataClient.post('/catalog/hotel-locations/', payload);
}

export async function updateCatalogHotelLocation(id: string | number, payload: Record<string, unknown>): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/hotel-locations/${id}/`, payload);
}

export async function deleteCatalogHotelLocation(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`/catalog/hotel-locations/${id}/`);
}
