import { PaginatedResponse, TripList, TripDetail } from "@/types/api";
import { serverFetch } from "@/lib/api";

export async function getAllTrips(params?: Record<string, string>): Promise<TripList[]> {
  try {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value && key !== "page_size") {
          query.append(key, value);
        }
      });
    }

    const allResults: TripList[] = [];
    let endpoint = `/trips/?${query.toString()}`;

    while (endpoint) {
      const data = await serverFetch<PaginatedResponse<TripList>>(endpoint, {
        next: { revalidate: 60 }
      });
      allResults.push(...data.results);
      
      // serverFetch expects relative paths, data.next gives absolute URL.
      if (data.next) {
        const url = new URL(data.next);
        endpoint = url.pathname + url.search;
        // Adjust if api/v1 is included in the path, serverFetch prepends /api/v1
        endpoint = endpoint.replace('/api/v1', '');
      } else {
        break;
      }
    }

    return allResults;
  } catch (error) {
    console.error("Error in getAllTrips:", error);
    return [];
  }
}

export async function getTripById(idOrSlug: string): Promise<TripDetail | null> {
  try {
    return await serverFetch<TripDetail>(`/trips/${idOrSlug}/`, {
      next: { revalidate: 60 }
    });
  } catch (error: any) {
    if (error.message?.includes('404')) return null;
    console.error(`Error in getTripById(${idOrSlug}):`, error);
    return null;
  }
}
