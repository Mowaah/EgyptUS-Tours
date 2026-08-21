import { PaginatedResponse, TripList, TripDetail } from "@/types/api";
import { serverFetch } from "@/lib/api";
import { Trip } from "@/types";
import { getFullHotelBySlug } from "@/services/hotelsService";

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

export async function getFullTripById(idOrSlug: string, relatedTripsData: TripList[] = []): Promise<Trip | null> {
  const tripDetail = await getTripById(idOrSlug);
  if (!tripDetail) {
    return null;
  }

  return {
    id: tripDetail.slug,
    title: tripDetail.title,
    description: tripDetail.description || tripDetail.short_description,
    image: tripDetail.image || "/images/pyramids4.jpg",
    images: tripDetail.images?.length ? tripDetail.images : ["/images/pyramids4.jpg"],
    location: (tripDetail.destinations?.length ? tripDetail.destinations.map(d => typeof d === 'string' ? d : (d.name || d.title)).filter(Boolean).join(' · ') : null) || tripDetail.location_text || "Egypt",
    price: parseFloat(tripDetail.base_price) || 0,
    currency: tripDetail.currency_code === "USD" ? "$" : tripDetail.currency_code,
    priceLabel: tripDetail.price_label,
    duration: tripDetail.duration,
    rating: parseFloat(tripDetail.rating_avg) || 0,
    reviewCount: tripDetail.review_count,
    isFavorite: tripDetail.is_favorite,
    brochureUrl: tripDetail.brochure_url || undefined,
    tags: tripDetail.tags?.map(t => t.name) || [],
    privatePrice: tripDetail.private_price ? parseFloat(tripDetail.private_price) : undefined,
    groupPrice: tripDetail.group_price ? parseFloat(tripDetail.group_price) : undefined,
    overview: tripDetail.overview ? {
      description: tripDetail.overview.description,
      culturalValue: tripDetail.overview.cultural_value,
      whoIsItFor: tripDetail.overview.who_is_it_for,
    } : { description: "", culturalValue: "", whoIsItFor: "" },
    included: tripDetail.included || [],
    excluded: tripDetail.excluded || [],
    itinerary: (tripDetail.itinerary || []).map(day => ({
      day: day.day_number,
      title: day.title,
      subtitle: day.subtitle,
      description: day.description,
      image: day.image || undefined,
      value: day.value_amount ? parseFloat(day.value_amount) : undefined,
      durationHours: day.duration_hours || undefined,
      meals: day.meals_count || undefined,
      highlights: day.highlights || [],
    })),
    availabilityEnabled: Boolean(tripDetail.availability_enabled ?? ((tripDetail.availability || []).length > 0)),
    availability: (tripDetail.availability || []).map(slot => ({
      id: slot.id,
      dates: `${slot.start_date} - ${slot.end_date}`,
      duration: `${tripDetail.duration.days} Days / ${tripDetail.duration.nights} Nights`,
      spotsLeft: slot.capacity_remaining,
      totalSpots: slot.capacity_total,
    })),
    vipExperiences: (tripDetail.vip_experiences || []).map(vip => ({
      title: vip.title,
      description: vip.description,
      image: vip.image || "/images/pyramids4.jpg",
      rating: parseFloat(vip.rating) || 0,
      reviewCount: vip.review_count,
      originalPrice: parseFloat(vip.original_price) || 0,
      discountedPrice: parseFloat(vip.discounted_price) || 0,
      savings: parseFloat(vip.savings_amount) || 0,
      badge: vip.badge,
      features: vip.features || [],
    })),
    importantLinks: (tripDetail.important_links || []).map(link => ({
      label: link.label,
      href: link.href,
    })),
    pricing: (tripDetail.pricing || []).map((season, idx) => {
      let tourType: "private" | "group" = season.tour_type as "private" | "group";
      if (!tourType) {
        if (tripDetail.pricing && tripDetail.pricing.length === 2) {
          tourType = idx === 0 ? "private" : "group";
        } else {
          tourType = "group";
        }
      }
      return {
        tourType,
        season: season.season_label,
        tiers: (season.tiers || []).map(tier => ({
          label: tier.label,
          price: parseFloat(tier.price) || 0,
        }))
      };
    }),
    travelerPhotos: tripDetail.traveler_photos || [],
    hotels: await Promise.all(
      (tripDetail.hotels || []).map(async (link) => {
        try {
          if (link.hotel?.slug) {
            const fullHotel = await getFullHotelBySlug(link.hotel.slug);
            if (fullHotel) {
              return {
                slug: fullHotel.id,
                name: fullHotel.name,
                location: fullHotel.location,
                description: fullHotel.description || fullHotel.subtitle || fullHotel.secondDescription || "",
                image: fullHotel.image || link.hotel.hero_image || "/images/hotels/hotel1.jpg",
                photos: fullHotel.images?.length ? fullHotel.images : (fullHotel.image ? [fullHotel.image] : ["/images/hotels/hotel1.jpg"]),
                rating: fullHotel.stars || 0,
                reviewCount: fullHotel.reviews || 0,
                amenities: fullHotel.facilities?.length ? fullHotel.facilities : (link.hotel.amenities || link.hotel.facilities || []),
              };
            }
          }
        } catch (err) {
          console.error("Error fetching full hotel detail:", err);
        }
        return {
          slug: link.hotel.slug,
          name: link.hotel.name,
          location: link.hotel.location_text,
          description: link.hotel.description || "",
          image: link.hotel.hero_image || "/images/hotels/hotel1.jpg",
          photos: link.hotel.photos?.length ? link.hotel.photos : (link.hotel.hero_image ? [link.hotel.hero_image] : ["/images/hotels/hotel1.jpg"]),
          rating: link.hotel.stars || 0,
          reviewCount: link.hotel.review_count || 0,
          amenities: link.hotel.amenities || link.hotel.facilities || [],
        };
      })
    ),
    reviews: (tripDetail.trip_reviews || []).map(r => ({
      image: "/images/testimonials/marcus.jpg",
      name: r.author_name,
      location: r.author_country || "Unknown",
      quote: r.body,
      rating: parseFloat(r.rating) || 0,
    })),
    relatedTrips: relatedTripsData
      .filter(t => t.id !== tripDetail.id)
      .slice(0, 4)
      .map(t => ({
        id: t.slug,
        title: t.title,
        description: t.short_description || t.title,
        image: t.image || "/images/home/hero-bg.png",
        location: (t.destinations?.length ? t.destinations.map(d => typeof d === 'string' ? d : (d.name || d.title)).filter(Boolean).join(' · ') : null) || t.location_text || "Egypt",
        price: parseFloat(t.base_price) || 0,
        currency: t.currency_code === "USD" ? "$" : t.currency_code,
        duration: t.duration,
        rating: parseFloat(t.rating_avg) || 0,
        reviewCount: t.review_count,
        isFavorite: t.is_favorite,
        priceLabel: t.price_label,
        discountLabel: (t as any).discount_label || undefined,
        tags: t.tags?.map(tag => tag.name) || [],
      }))
  };
}
