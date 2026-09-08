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
  const firstPage = await getCategories({ ...params, page: 1 });
  if (Array.isArray(firstPage)) return firstPage;

  const results: ApiResponse[] = Array.isArray(firstPage?.results)
    ? [...firstPage.results]
    : Array.isArray(firstPage?.data?.results)
    ? [...firstPage.data.results]
    : Array.isArray(firstPage?.data)
    ? [...firstPage.data]
    : [];

  const count = firstPage?.count ?? firstPage?.data?.count ?? results.length;
  const pageSize = results.length > 0 ? results.length : 10;
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages > 1) {
    const pagePromises = [];
    for (let p = 2; p <= totalPages; p++) {
      pagePromises.push(getCategories({ ...params, page: p }));
    }
    const subsequentPages = await Promise.all(pagePromises);
    for (const res of subsequentPages) {
      const pageResults = Array.isArray(res?.results)
        ? res.results
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data)
        ? res.data
        : [];
      results.push(...pageResults);
    }
  }

  return results;
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
