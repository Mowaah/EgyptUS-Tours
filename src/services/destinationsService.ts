import { PaginatedResponse } from "@/types/api";
import { serverFetch } from "@/lib/api";

export interface DestinationList {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  region: string;
  region_display: string;
  image: string | null;
  thumbnail: string | null;
  is_featured: boolean;
  children_count: number;
  order?: number;
  translations?: Record<string, { name?: string; title?: string }>;
}

export async function getAllDestinations(params?: Record<string, string>): Promise<DestinationList[]> {
  try {
    const query = new URLSearchParams({ page_size: "100", ...(params || {}) });
    const allResults: DestinationList[] = [];
    let endpoint = `/destinations/?${query.toString()}`;

    while (endpoint) {
      const data = await serverFetch<PaginatedResponse<DestinationList>>(endpoint, {
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
    console.error("Error in getAllDestinations:", error);
    return [];
  }
}

