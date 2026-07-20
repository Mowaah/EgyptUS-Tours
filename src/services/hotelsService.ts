import { HotelPaginatedResponse, HotelDetail, HotelList } from "@/types/api";
import { serverFetch } from "@/lib/api";

/**
 * Fetch all hotels (Paginated)
 */
export async function getHotels(params?: Record<string, any>): Promise<HotelPaginatedResponse> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return serverFetch<HotelPaginatedResponse>(`/hotels/${query}`);
}

/**
 * Fetch a single hotel by its slug (detail endpoint).
 */
export async function getHotelBySlug(slug: string): Promise<HotelDetail> {
  return serverFetch<HotelDetail>(`/hotels/${slug}/`);
}

/**
 * Fetch all hotels completely by iterating pages if necessary.
 */
export async function getAllHotels(): Promise<HotelList[]> {
  const firstPage = await getHotels();
  const results = [...firstPage.results];
  const totalPages = Math.ceil(firstPage.count / 10);
  
  if (totalPages > 1) {
    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(getHotels({ page: i }));
    }
    const pages = await Promise.all(promises);
    pages.forEach(p => results.push(...p.results));
  }
  
  return results;
}
