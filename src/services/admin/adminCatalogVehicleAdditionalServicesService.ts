import { adminDataClient } from '@/lib/adminCoreApi';

type QueryParams = Record<string, unknown>;
// Admin clients are currently untyped across the dashboard service layer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = any;

export async function getVehicleAdditionalServices(params?: QueryParams): Promise<ApiResponse> {
  return await adminDataClient.get('/catalog/vehicle-additional-services/', { params });
}

export async function getAllVehicleAdditionalServices(params?: QueryParams): Promise<ApiResponse[]> {
  const firstPage = await getVehicleAdditionalServices({ ...params, page: 1 });
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
      pagePromises.push(getVehicleAdditionalServices({ ...params, page: p }));
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
