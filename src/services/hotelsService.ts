import { HotelPaginatedResponse, HotelDetail, HotelList } from "@/types/api";
import { serverFetch } from "@/lib/api";

function parseHotelPriceEgp(priceEgp?: string | null, fallbackPrice?: string | null): number {
  return parseFloat(priceEgp || fallbackPrice || "0") || 0;
}

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
  try {
    return await serverFetch<HotelDetail>(`/hotels/${slug}/`);
  } catch (error: any) {
    if (error.message?.includes('404')) {
      try {
        const all = await getAllHotels();
        let matched = all.find(h => h.slug === slug || String(h.id) === slug);
        if (!matched) {
          for (const lang of ['es', 'it', 'en']) {
            const langHotels = await getHotels({ lang });
            matched = langHotels.results?.find(h => h.slug === slug || String(h.id) === slug);
            if (matched) break;
          }
        }
        if (matched && String(matched.id) !== slug) {
          return await serverFetch<HotelDetail>(`/hotels/${matched.id}/`);
        }
      } catch (fallbackErr) {
        console.error(`Fallback ID lookup failed for hotel ${slug}:`, fallbackErr);
      }
    }
    throw error;
  }
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
    pricePerNight: (() => {
      const basePrice = parseHotelPriceEgp(hotelDetail.price_per_night_egp, hotelDetail.price_per_night);
      const discountPerc = hotelDetail.discount_value ? parseFloat(hotelDetail.discount_value) : 0;
      return discountPerc > 0 ? basePrice * (1 - discountPerc / 100) : basePrice;
    })(),
    pricePerNightEgp: hotelDetail.price_per_night_egp ? parseFloat(hotelDetail.price_per_night_egp) : undefined,
    pricePerNightEur: hotelDetail.price_per_night_eur ? parseFloat(hotelDetail.price_per_night_eur) : undefined,
    prices: {
      usd: (() => {
        const p = parseFloat(hotelDetail.price_per_night) || 0;
        const discountPerc = hotelDetail.discount_value ? parseFloat(hotelDetail.discount_value) : 0;
        return discountPerc > 0 ? p * (1 - discountPerc / 100) : p;
      })(),
      egp: hotelDetail.price_per_night_egp != null ? (() => {
        const p = parseFloat(hotelDetail.price_per_night_egp) || 0;
        const discountPerc = hotelDetail.discount_value ? parseFloat(hotelDetail.discount_value) : 0;
        return discountPerc > 0 ? p * (1 - discountPerc / 100) : p;
      })() : undefined,
      eur: hotelDetail.price_per_night_eur != null ? (() => {
        const p = parseFloat(hotelDetail.price_per_night_eur) || 0;
        const discountPerc = hotelDetail.discount_value ? parseFloat(hotelDetail.discount_value) : 0;
        return discountPerc > 0 ? p * (1 - discountPerc / 100) : p;
      })() : undefined,
    },
    originalPrice: hotelDetail.discount_value && parseFloat(hotelDetail.discount_value) > 0 
      ? parseHotelPriceEgp(hotelDetail.price_per_night_egp, hotelDetail.price_per_night) 
      : undefined,
    originalPrices: hotelDetail.discount_value && parseFloat(hotelDetail.discount_value) > 0 ? {
      usd: parseFloat(hotelDetail.price_per_night) || 0,
      egp: hotelDetail.price_per_night_egp != null ? parseFloat(hotelDetail.price_per_night_egp) || 0 : undefined,
      eur: hotelDetail.price_per_night_eur != null ? parseFloat(hotelDetail.price_per_night_eur) || 0 : undefined,
    } : undefined,
    discountTitle: hotelDetail.discount_title || undefined,
    discountValue: hotelDetail.discount_value ? `${parseFloat(hotelDetail.discount_value)}% Off` : undefined,
    reviews: hotelDetail.review_count,
    description: hotelDetail.description,
    secondDescription: hotelDetail.second_description,
    subtitle: hotelDetail.subtitle,
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
      category: r.category_label || "",
      type: r.type_label || "",
      view: r.view_label || "",
      pricePerNight: parseHotelPriceEgp(r.price_per_night_egp, r.price_per_night),
      pricePerNightEgp: r.price_per_night_egp ? parseFloat(r.price_per_night_egp) : undefined,
      pricePerNightEur: r.price_per_night_eur ? parseFloat(r.price_per_night_eur) : undefined,
      prices: {
        usd: r.price_per_night ? parseFloat(r.price_per_night) : undefined,
        egp: r.price_per_night_egp ? parseFloat(r.price_per_night_egp) : undefined,
        eur: r.price_per_night_eur ? parseFloat(r.price_per_night_eur) : undefined,
      },
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
  } catch {
    return null;
  }
}
