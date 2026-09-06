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
    if (params?.applies_to) query.append("applies_to", params.applies_to);
    if (params?.trip_id) query.append("trip_id", String(params.trip_id));
    if (params?.hotel_id) query.append("hotel_id", String(params.hotel_id));
    if (params?.vehicle_id) query.append("vehicle_id", String(params.vehicle_id));
    if (params?.lang) query.append("lang", params.lang);

    const qs = query.toString();
    const endpoint = `/promotions/${qs ? `?${qs}` : ""}`;
    const data = await serverFetch<PaginatedResponse<PublicPromotion>>(endpoint, {
      next: { revalidate: 60 },
    });
    return data?.results ?? [];
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
    const response = await apiClient.get<PaginatedResponse<PublicPromotion>>('/promotions/', {
      params,
    });
    const data = response as unknown as PaginatedResponse<PublicPromotion>;
    return data?.results ?? [];
  } catch (error) {
    console.error("Error in fetchPublicPromotionsClient:", error);
    return [];
  }
}
