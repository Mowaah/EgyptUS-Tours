import { VehiclePaginatedResponse, VehicleDetail, VehicleList } from "@/types/api";
import { VehicleRoutePublic } from "@/types/transportation";
import { serverFetch } from "@/lib/api";

/**
 * Fetch all vehicles (Paginated)
 */
export async function getVehicles(params?: Record<string, any>): Promise<VehiclePaginatedResponse> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return serverFetch<VehiclePaginatedResponse>(`/vehicles/${query}`, { next: { revalidate: 60 } });
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
  try {
    const firstPage = await getVehicles();
    const results = [...(firstPage?.results || [])];
    const pageSize = results.length > 0 ? results.length : 10;
    const totalPages = Math.ceil((firstPage?.count || results.length) / pageSize);
    
    if (totalPages > 1) {
      const promises = [];
      for (let i = 2; i <= totalPages; i++) {
        promises.push(getVehicles({ page: i }));
      }
      const pages = await Promise.all(promises);
      pages.forEach(p => results.push(...(p?.results || [])));
    }
    return results;
  } catch (error) {
    console.error("Error in getAllVehicles:", error);
    return [];
  }
}

export async function getVehicleRoutes(slug: string, lang = "en"): Promise<VehicleRoutePublic[]> {
  try {
    return await serverFetch<VehicleRoutePublic[]>(`/vehicles/${slug}/routes/?lang=${lang}`);
  } catch (error) {
    console.error("Error in getVehicleRoutes:", error);
    return [];
  }
}


