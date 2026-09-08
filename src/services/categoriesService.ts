import { serverFetch } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { getAllTrips } from "@/services/tripsService";

export interface CategoryList {
  id: number;
  name: string;
  slug: string;
  is_system?: boolean;
}

export async function getAllCategories(): Promise<CategoryList[]> {
  try {
    const allResults: CategoryList[] = [];
    let endpoint = "/tags/?page_size=100";

    while (endpoint) {
      const data = await serverFetch<PaginatedResponse<CategoryList>>(endpoint, {
        next: { revalidate: 60 },
      });
      if (Array.isArray(data?.results)) {
        allResults.push(...data.results);
      }

      if (data?.next && data?.results?.length && allResults.length < (data?.count ?? allResults.length + 1)) {
        const url = new URL(data.next);
        endpoint = url.pathname + url.search;
        endpoint = endpoint.replace('/api/v1', '');
      } else {
        break;
      }
    }

    return allResults;
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return [];
  }
}


/**
 * Returns only categories that have published trips with destination Egypt.
 */
export async function getEgyptTripCategories(): Promise<CategoryList[]> {
  try {
    const egyptTrips = await getAllTrips({ destination: "egypt" });
    const categoryMap = new Map<string, CategoryList>();

    for (const trip of egyptTrips) {
      if (Array.isArray(trip.tags)) {
        for (const tag of trip.tags) {
          if (tag.name && !categoryMap.has(tag.name.toLowerCase())) {
            categoryMap.set(tag.name.toLowerCase(), {
              id: tag.id,
              name: tag.name,
              slug: tag.slug,
            });
          }
        }
      }
    }

    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error in getEgyptTripCategories:", error);
    return [];
  }
}
