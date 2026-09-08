import { adminDataClient } from '@/lib/adminCoreApi';
import { apiClient as publicDataClient } from '@/lib/api';

type QueryParams = Record<string, unknown>;
type CatalogTripPayload = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

export async function getCatalogTrips(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/trips/', { params });
}

export async function getCatalogTripDetail(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.get(`/catalog/trips/${id}/`);
}

export async function createCatalogTrip(payload: CatalogTripPayload): Promise<ApiResponse> {
  return await adminDataClient.post('/catalog/trips/', payload);
}

export async function updateCatalogTrip(id: string | number, payload: CatalogTripPayload): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/trips/${id}/`, payload);
}

export async function updateTripBrochure(id: string | number, brochure: File): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('brochure', brochure);

  return await adminDataClient.patch(`/catalog/trips/${id}/overview/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function getCatalogHotels(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/hotels/', { params });
}

export async function getCategories(params?: QueryParams): Promise<ApiResponse> {
  // Using public client for categories since it's a public endpoint
  return await publicDataClient.get('/categories/', { params });
}

export async function getDestinations(params?: QueryParams): Promise<ApiResponse> {
  if (Number(params?.limit) >= 100 || Number(params?.page_size) >= 100) {
    try {
      let page = 1;
      const allResults: Record<string, unknown>[] = [];
      while (true) {
        const res: Record<string, unknown> = await publicDataClient.get('/destinations/', { params: { ...params, page } });
        const items = (Array.isArray(res?.results) ? res.results : Array.isArray(res?.data) ? res.data : []) as Record<string, unknown>[];
        allResults.push(...items);
        const total = Number(res?.count ?? allResults.length);
        if (!res?.next || items.length === 0 || allResults.length >= total) {
          break;
        }
        page++;
      }
      return { count: allResults.length, results: allResults };
    } catch {
      return await publicDataClient.get('/destinations/', { params });
    }
  }
  return await publicDataClient.get('/destinations/', { params });
}

export async function archiveCatalogTrip(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.post(`/catalog/trips/${id}/archive/`);
}

export async function publishCatalogTrip(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.post(`/catalog/trips/${id}/publish/`);
}

export async function unpublishCatalogTrip(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.post(`/catalog/trips/${id}/unpublish/`);
}

export async function deleteCatalogTrip(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`/catalog/trips/${id}/`);
}

export interface TripSeoPayload {
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

export async function updateTripSeo(id: string | number, payload: TripSeoPayload): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/trips/${id}/seo/`, payload);
}
