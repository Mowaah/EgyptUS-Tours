import { serverFetch, apiClient } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";

export interface PublicPromotion {
  id: number;
  offer_number: string;
  title: string;
  description: string;
  discount_value: string;
  applies_to: 'trip' | 'hotel' | 'transport';
  valid_from: string | null;
  valid_to: string | null;
  trip_ids: number[];
  hotel_ids: number[];
  vehicle_ids: number[];
}

export interface PromotionFilterParams {
  applies_to?: 'trip' | 'hotel' | 'transport';
  trip_id?: number;
  hotel_id?: number;
  vehicle_id?: number;
  lang?: string;
}

/**
 * Server-side fetch utility for active public promotions (with Next.js revalidation cache).
 */
export async function getPublicPromotions(params?: PromotionFilterParams): Promise<PublicPromotion[]> {
  try {
    const query = new URLSearchParams();
    query.append("page_size", "100");
    if (params?.applies_to) query.append("applies_to", params.applies_to);
    if (params?.trip_id) query.append("trip_id", String(params.trip_id));
    if (params?.hotel_id) query.append("hotel_id", String(params.hotel_id));
    if (params?.vehicle_id) query.append("vehicle_id", String(params.vehicle_id));
    if (params?.lang) query.append("lang", params.lang);

    const allResults: PublicPromotion[] = [];
    let endpoint = `/promotions/?${query.toString()}`;

    while (endpoint) {
      const data = await serverFetch<PaginatedResponse<PublicPromotion>>(endpoint, {
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
    console.error("Error in getPublicPromotions:", error);
    return [];
  }
}

/**
 * Client-side fetch utility for active public promotions.
 */
export async function fetchPublicPromotionsClient(params?: PromotionFilterParams): Promise<PublicPromotion[]> {
  try {
    let page = 1;
    const allResults: PublicPromotion[] = [];
    while (true) {
      const response = await apiClient.get<PaginatedResponse<PublicPromotion>>('/promotions/', {
        params: { page_size: 100, ...params, page },
      });
      const data = response as unknown as PaginatedResponse<PublicPromotion>;
      const items = Array.isArray(data?.results) ? data.results : [];
      allResults.push(...items);
      const count = Number(data?.count ?? allResults.length);
      if (!data?.next || items.length === 0 || allResults.length >= count) {
        break;
      }
      page++;
    }
    return allResults;
  } catch (error) {
    console.error("Error in fetchPublicPromotionsClient:", error);
    return [];
  }
}

