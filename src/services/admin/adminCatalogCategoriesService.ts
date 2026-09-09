import { adminDataClient } from '@/lib/adminCoreApi';

type QueryParams = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

const TRIP_CATEGORIES_ENDPOINT = '/catalog/trip-categories/';

export async function getCategories(params?: QueryParams): Promise<ApiResponse> {
  if (Number(params?.limit) >= 100 || Number(params?.page_size) >= 100) {
    const all = await getAllCategories(params);
    return { count: all.length, results: all };
  }
  return await adminDataClient.get(TRIP_CATEGORIES_ENDPOINT, { params });
}


export async function getAllCategories(params?: QueryParams): Promise<ApiResponse[]> {
  try {
    let page = 1;
    const allResults: ApiResponse[] = [];
    while (true) {
      const res: ApiResponse = await adminDataClient.get(TRIP_CATEGORIES_ENDPOINT, {
        params: { ...params, page },
      });
      if (Array.isArray(res)) return res;
      const items = (Array.isArray(res?.results) ? res.results : Array.isArray(res?.data) ? res.data : []) as ApiResponse[];
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

export async function createCategory(data: { translations: Record<string, { name: string }> }): Promise<ApiResponse> {
  return await adminDataClient.post(TRIP_CATEGORIES_ENDPOINT, { ...data, name: data.translations.en?.name });
}

export async function updateCategory(id: string | number, data: { translations?: Record<string, { name: string }> }): Promise<ApiResponse> {
  return await adminDataClient.patch(`${TRIP_CATEGORIES_ENDPOINT}${id}/`, { ...data, name: data.translations?.en?.name });
}

export async function deleteCategory(id: string | number): Promise<ApiResponse> {
  return await adminDataClient.delete(`${TRIP_CATEGORIES_ENDPOINT}${id}/`);
}
