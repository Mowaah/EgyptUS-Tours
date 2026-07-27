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

export function mapHotelDetailToHotel(hotelDetail: HotelDetail): import("@/types").Hotel {
  return {
    id: hotelDetail.slug,
    name: hotelDetail.name,
    location: hotelDetail.location_text || "",
    address: hotelDetail.address || "",
    image: hotelDetail.hero_image || "/images/pyramids.jpg",
    images: [
      hotelDetail.hero_image || "/images/pyramids.jpg",
      ...(hotelDetail.gallery_images || [])
    ].filter(Boolean) as string[],
    stars: hotelDetail.stars,
    rating: parseFloat(hotelDetail.rating_avg) || 0,
    rooms: hotelDetail.rooms,
    pricePerNight: parseFloat(hotelDetail.price_per_night) || 0,
    reviews: hotelDetail.review_count,
    description: hotelDetail.description,
    isFavorite: hotelDetail.is_favorite,
    overview: {
      sections: (hotelDetail.overview_sections || []).map(s => ({
        heading: s.title,
        body: s.body
      }))
    },
    facilities: hotelDetail.facilities || [],
    mapEmbedUrl: hotelDetail.map_embed_url || undefined,
    hotelRooms: (hotelDetail.hotel_rooms || []).map(r => ({
      id: r.id.toString(),
      name: r.name,
      description: r.description,
      type: r.type_label || "",
      view: r.view_label || "",
      pricePerNight: parseFloat(r.price_per_night) || 0,
      discountPercent: r.discount_percent,
      features: r.features || [],
      images: (r.images || []).map(img => img.image)
    })),
    hotelReviews: (hotelDetail.hotel_reviews || []).map(r => ({
      title: r.title,
      body: r.body,
      author: r.author_name,
      date: new Date(r.review_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      rating: parseFloat(r.rating) || 0
    }))
  };
}

export async function getFullHotelBySlug(slug: string): Promise<import("@/types").Hotel | null> {
  try {
    const detail = await getHotelBySlug(slug);
    if (!detail) return null;
    return mapHotelDetailToHotel(detail);
  } catch (error) {
    console.error("Error fetching hotel detail:", error);
    return null;
  }
}
