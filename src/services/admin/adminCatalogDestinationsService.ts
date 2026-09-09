import { adminDataClient } from '@/lib/adminCoreApi';
import { apiClient as publicDataClient } from '@/lib/api';
import { fileToBase64 } from '@/utils/imageUtils';

type QueryParams = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

export async function getDestinations(params?: QueryParams): Promise<ApiResponse> {
  if (Number(params?.limit) >= 100 || Number(params?.page_size) >= 100) {
    const all = await getAllDestinations(params);
    return { count: all.length, results: all };
  }
  return await adminDataClient.get('/catalog/destinations/', { params });
}


export async function getAllDestinations(params?: QueryParams): Promise<Record<string, unknown>[]> {
  try {
    let page = 1;
    const allResults: Record<string, unknown>[] = [];
    while (true) {
      const res: Record<string, unknown> = await adminDataClient.get('/catalog/destinations/', {
        params: { ...params, page },
      });
      if (Array.isArray(res)) return res as Record<string, unknown>[];
      const items = (Array.isArray(res?.results) ? res.results : Array.isArray(res?.data) ? res.data : []) as Record<string, unknown>[];
      allResults.push(...items);
      const total = Number(res?.count ?? allResults.length);
      if (!res?.next || items.length === 0 || allResults.length >= total) {
        break;
      }
      page++;
    }
    return allResults;
  } catch {
    // If admin endpoint fails or 404s, fall back to public client
    try {
      let page = 1;
      const allResults: Record<string, unknown>[] = [];
      while (true) {
        const res: Record<string, unknown> = await publicDataClient.get('/destinations/', {
          params: { ...params, page },
        });
        const items = (Array.isArray(res?.results) ? res.results : Array.isArray(res?.data) ? res.data : []) as Record<string, unknown>[];
        allResults.push(...items);
        const total = Number(res?.count ?? allResults.length);
        if (!res?.next || items.length === 0 || allResults.length >= total) {
          break;
        }
        page++;
      }
      return allResults;
    } catch {
      return [];
    }
  }
}

async function buildDestinationPayload(data: { translations?: Record<string, { name: string }>; image?: File }) {
  const payload: { translations?: Record<string, { name: string }>; name?: string; image?: string } = {};
  if (data.translations !== undefined) {
    payload.translations = data.translations;
    payload.name = data.translations.en?.name;
  }
  if (data.image) payload.image = await fileToBase64(data.image);
  return payload;
}

export async function createDestination(data: { translations: Record<string, { name: string }>; image?: File }): Promise<ApiResponse> {
  return await adminDataClient.post('/catalog/destinations/', await buildDestinationPayload(data));
}

export async function updateDestination(id: string | number, data: { translations?: Record<string, { name: string }>; image?: File }): Promise<ApiResponse> {
  return await adminDataClient.patch(`/catalog/destinations/${id}/`, await buildDestinationPayload(data));
}

export async function deleteDestination(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`/catalog/destinations/${id}/`);
}
