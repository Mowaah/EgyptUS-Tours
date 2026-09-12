import { serverFetch } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { getAllTrips } from "@/services/tripsService";
import { isDesertCategory } from "@/constants";

export interface CategoryList {
  id: number;
  name: string;
  slug: string;
  is_system?: boolean;
  translations?: Record<string, { name?: string; title?: string }>;
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
 * Returns only categories that have published trips with destination Egypt (excluding desert categories).
 */
export async function getEgyptTripCategories(): Promise<CategoryList[]> {
  try {
    const [allTags, egyptTrips] = await Promise.all([
      getAllCategories(),
      getAllTrips({ destination: "egypt" }),
    ]);
    const validCategoryIds = new Set<number>();
    const validCategorySlugs = new Set<string>();

    for (const trip of egyptTrips) {
      if (Array.isArray(trip.tags)) {
        for (const tag of trip.tags) {
          if (
            tag.name &&
            !isDesertCategory(tag.name) &&
            !isDesertCategory(tag.slug)
          ) {
            validCategoryIds.add(tag.id);
            if (tag.slug) validCategorySlugs.add(tag.slug.toLowerCase());
          }
        }
      }
    }

    // Filter allTags preserving the backend's custom order (ordered by order, name)
    const result = allTags.filter(
      (tag) =>
        validCategoryIds.has(tag.id) ||
        (tag.slug && validCategorySlugs.has(tag.slug.toLowerCase()))
    );

    if (result.length > 0) {
      return result;
    }

    // Fallback if allTags was empty
    const categoryMap = new Map<string, CategoryList>();
    for (const trip of egyptTrips) {
      if (Array.isArray(trip.tags)) {
        for (const tag of trip.tags) {
          if (
            tag.name &&
            !isDesertCategory(tag.name) &&
            !isDesertCategory(tag.slug) &&
            !categoryMap.has(tag.name.toLowerCase())
          ) {
            categoryMap.set(tag.name.toLowerCase(), {
              id: tag.id,
              name: tag.name,
              slug: tag.slug,
              translations: (tag as any).translations,
            });
          }
        }
      }
    }
    return Array.from(categoryMap.values());
  } catch (error) {
    console.error("Error in getEgyptTripCategories:", error);
    return [];
  }
}
