import { VehiclePaginatedResponse, VehicleDetail, VehicleList } from "@/types/api";
import { serverFetch } from "@/lib/api";

/**
 * Fetch all vehicles (Paginated)
 */
export async function getVehicles(params?: Record<string, any>): Promise<VehiclePaginatedResponse> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return serverFetch<VehiclePaginatedResponse>(`/vehicles/${query}`);
}

/**
 * Fetch a single vehicle by its slug (detail endpoint).
 */
export async function getVehicleBySlug(slug: string): Promise<VehicleDetail> {
  return serverFetch<VehicleDetail>(`/vehicles/${slug}/`);
}

/**
 * Fetch all vehicles completely by iterating pages if necessary.
 */
export async function getAllVehicles(): Promise<VehicleList[]> {
  const firstPage = await getVehicles();
  const results = [...firstPage.results];
  const totalPages = Math.ceil(firstPage.count / 10);
  
  if (totalPages > 1) {
    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(getVehicles({ page: i }));
    }
    const pages = await Promise.all(promises);
    pages.forEach(p => results.push(...p.results));
  }
  
  return results;
}
