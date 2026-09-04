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

export async function getTripById(idOrSlug: string, relatedTripsData?: TripList[]): Promise<TripDetail | null> {
  try {
    return await serverFetch<TripDetail>(`/trips/${idOrSlug}/`, {
      next: { revalidate: 60 }
    });
  } catch (error: any) {
    // If slug lookup failed (common with localized/translated slugs like Spanish 'odisea-clasica-por-el-nilo'),
    // resolve the trip's numeric ID via the trip list and query by ID
    try {
      let list = relatedTripsData;
      if (!list || list.length === 0) {
        list = await getAllTrips();
      }
      let matched = list.find(t => t.slug === idOrSlug || String(t.id) === idOrSlug);

      if (!matched) {
        for (const lang of ['es', 'it', 'en']) {
          const langTrips = await getAllTrips({ lang });
          matched = langTrips.find(t => t.slug === idOrSlug || String(t.id) === idOrSlug);
          if (matched) break;
        }
      }

      if (matched && String(matched.id) !== idOrSlug) {
        return await serverFetch<TripDetail>(`/trips/${matched.id}/`, {
          next: { revalidate: 60 }
        });
      }
    } catch (fallbackErr) {
      console.error(`Fallback ID lookup failed for trip ${idOrSlug}:`, fallbackErr);
    }

    if (error.message?.includes('404')) return null;
    console.error(`Error in getTripById(${idOrSlug}):`, error);
    return null;
  }
}

export async function getFullTripById(idOrSlug: string, relatedTripsData: TripList[] = []): Promise<Trip | null> {
  const tripDetail = await getTripById(idOrSlug, relatedTripsData);
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
    price: (() => {
      const basePrice = parseFloat(tripDetail.base_price) || 0;
      const discountPerc = tripDetail.discount_value ? parseFloat(tripDetail.discount_value) : 0;
      return discountPerc > 0 ? basePrice * (1 - discountPerc / 100) : basePrice;
    })(),
    prices: {
      usd: (() => {
        const p = parseFloat(tripDetail.base_price) || 0;
        const discountPerc = tripDetail.discount_value ? parseFloat(tripDetail.discount_value) : 0;
        return discountPerc > 0 ? p * (1 - discountPerc / 100) : p;
      })(),
      egp: tripDetail.base_price_egp != null ? (() => {
        const p = parseFloat(tripDetail.base_price_egp) || 0;
        const discountPerc = tripDetail.discount_value ? parseFloat(tripDetail.discount_value) : 0;
        return discountPerc > 0 ? p * (1 - discountPerc / 100) : p;
      })() : undefined,
      eur: tripDetail.base_price_eur != null ? (() => {
        const p = parseFloat(tripDetail.base_price_eur) || 0;
        const discountPerc = tripDetail.discount_value ? parseFloat(tripDetail.discount_value) : 0;
        return discountPerc > 0 ? p * (1 - discountPerc / 100) : p;
      })() : undefined,
    },
    originalPrice: tripDetail.discount_value && parseFloat(tripDetail.discount_value) > 0 ? parseFloat(tripDetail.base_price) : undefined,
    originalPrices: tripDetail.discount_value && parseFloat(tripDetail.discount_value) > 0 ? {
      usd: parseFloat(tripDetail.base_price) || 0,
      egp: tripDetail.base_price_egp != null ? parseFloat(tripDetail.base_price_egp) || 0 : undefined,
      eur: tripDetail.base_price_eur != null ? parseFloat(tripDetail.base_price_eur) || 0 : undefined,
    } : undefined,
    currency: tripDetail.currency_code === "USD" ? "$" : tripDetail.currency_code,
    priceLabel: tripDetail.price_label,
    discountLabel: tripDetail.discount_value ? (tripDetail.discount_title ? `${tripDetail.discount_title} - ${parseFloat(tripDetail.discount_value)}% Off` : `${parseFloat(tripDetail.discount_value)}% Off`) : undefined,
    discountTitle: tripDetail.discount_title || undefined,
    discountValue: tripDetail.discount_value ? `${parseFloat(tripDetail.discount_value)}% Off` : undefined,
    duration: tripDetail.duration,
    rating: parseFloat(tripDetail.rating_avg) || 0,
    reviewCount: tripDetail.review_count,
    isFavorite: tripDetail.is_favorite,
    brochureUrl: tripDetail.brochure_url || undefined,
    tags: tripDetail.tags?.map(t => t.name) || [],
    privatePrice: (() => {
      const privateSeasons = (tripDetail.pricing || []).filter(s => s.tour_type === "private");
      const allPrices = privateSeasons.flatMap(s => (s.tiers || []).map(t => parseFloat(t.price)).filter(p => p > 0));
      const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : (tripDetail.private_price ? parseFloat(tripDetail.private_price) : undefined);
      if (minPrice === undefined) return undefined;
      const discountPerc = tripDetail.discount_value ? parseFloat(tripDetail.discount_value) : 0;
      return discountPerc > 0 ? minPrice * (1 - discountPerc / 100) : minPrice;
    })(),
    privatePrices: (() => {
      const privateSeasons = (tripDetail.pricing || []).filter(s => s.tour_type === "private");
      const allTiers = privateSeasons.flatMap(s => (s.tiers || []).filter(t => parseFloat(t.price) > 0));
      const discountPerc = tripDetail.discount_value ? parseFloat(tripDetail.discount_value) : 0;
      const factor = discountPerc > 0 ? (1 - discountPerc / 100) : 1;

      if (allTiers.length > 0) {
        const minTier = allTiers.reduce((min, t) => parseFloat(t.price) < parseFloat(min.price) ? t : min, allTiers[0]);
        return {
          usd: parseFloat(minTier.price) * factor,
          egp: minTier.price_egp != null ? parseFloat(minTier.price_egp) * factor : (parseFloat(minTier.price) * 50 * factor),
          eur: minTier.price_eur != null ? parseFloat(minTier.price_eur) * factor : undefined,
        };
      }

      return {
        usd: tripDetail.private_price ? parseFloat(tripDetail.private_price) * factor : undefined,
        egp: tripDetail.private_price_egp ? parseFloat(tripDetail.private_price_egp) * factor : undefined,
        eur: tripDetail.private_price_eur ? parseFloat(tripDetail.private_price_eur) * factor : undefined,
      };
    })(),
    groupPrice: (() => {
      const groupSeasons = (tripDetail.pricing || []).filter(s => s.tour_type === "group");
      const allPrices = groupSeasons.flatMap(s => (s.tiers || []).map(t => parseFloat(t.price)).filter(p => p > 0));
      const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : (tripDetail.group_price ? parseFloat(tripDetail.group_price) : undefined);
      if (minPrice === undefined) return undefined;
      const discountPerc = tripDetail.discount_value ? parseFloat(tripDetail.discount_value) : 0;
      return discountPerc > 0 ? minPrice * (1 - discountPerc / 100) : minPrice;
    })(),
    groupPrices: (() => {
      const groupSeasons = (tripDetail.pricing || []).filter(s => s.tour_type === "group");
      const allTiers = groupSeasons.flatMap(s => (s.tiers || []).filter(t => parseFloat(t.price) > 0));
      const discountPerc = tripDetail.discount_value ? parseFloat(tripDetail.discount_value) : 0;
      const factor = discountPerc > 0 ? (1 - discountPerc / 100) : 1;

      if (allTiers.length > 0) {
        const minTier = allTiers.reduce((min, t) => parseFloat(t.price) < parseFloat(min.price) ? t : min, allTiers[0]);
        return {
          usd: parseFloat(minTier.price) * factor,
          egp: minTier.price_egp != null ? parseFloat(minTier.price_egp) * factor : (parseFloat(minTier.price) * 50 * factor),
          eur: minTier.price_eur != null ? parseFloat(minTier.price_eur) * factor : undefined,
        };
      }

      return {
        usd: tripDetail.group_price ? parseFloat(tripDetail.group_price) * factor : undefined,
        egp: tripDetail.group_price_egp ? parseFloat(tripDetail.group_price_egp) * factor : undefined,
        eur: tripDetail.group_price_eur ? parseFloat(tripDetail.group_price_eur) * factor : undefined,
      };
    })(),
    offersPrivateTour: (tripDetail.pricing || []).some(s => s.tour_type === "private" && (s.tiers || []).length > 0),
    offersGroupTour: (tripDetail.pricing || []).some(s => s.tour_type === "group" && (s.tiers || []).length > 0),
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
      badge: vip.badge || undefined,
      features: vip.features || [],
      added: vip.is_added_default,
    })),
    importantLinks: (tripDetail.important_links || []).map(link => ({
      label: link.label,
      href: link.href,
    })),
    pricing: (tripDetail.pricing || []).map(season => {
      let tourType: "private" | "group" | undefined = undefined;
      if (season.tour_type === "private" || season.tour_type === "group") {
        tourType = season.tour_type;
      }
      return {
        tourType,
        season: season.season_label,
        tiers: (season.tiers || []).map(tier => {
          const tierPrice = parseFloat(tier.price) || 0;
          const tierPriceEgp = tier.price_egp ? parseFloat(tier.price_egp) : 0;
          const tierPriceEur = tier.price_eur ? parseFloat(tier.price_eur) : 0;
          const discountPerc = tripDetail.discount_value ? parseFloat(tripDetail.discount_value) : 0;
          const discountedPrice = discountPerc > 0 ? tierPrice * (1 - discountPerc / 100) : tierPrice;
          return {
            label: tier.label,
            price: discountedPrice,
            prices: {
              usd: discountedPrice,
              egp: tier.price_egp ? (discountPerc > 0 ? tierPriceEgp * (1 - discountPerc / 100) : tierPriceEgp) : undefined,
              eur: tier.price_eur ? (discountPerc > 0 ? tierPriceEur * (1 - discountPerc / 100) : tierPriceEur) : undefined,
            },
          };
        })
      };
    }),
    seasonPricing: (() => {
      const seasons = tripDetail.pricing || [];
      let targetSeasons = seasons.filter(s => s.tour_type === 'private');
      if (targetSeasons.length === 0) targetSeasons = seasons.filter(s => s.tour_type === 'group');
      if (targetSeasons.length === 0) targetSeasons = seasons;

      return targetSeasons.map(s => {
        const getTierPriceObj = (key: string) => {
          const tier = (s.tiers || []).find(t => t.label.toLowerCase().includes(key));
          if (!tier) return { val: 0, valEgp: 0, valEur: 0 };
          const tierPrice = parseFloat(tier.price) || 0;
          const tierPriceEgp = tier.price_egp ? parseFloat(tier.price_egp) : 0;
          const tierPriceEur = tier.price_eur ? parseFloat(tier.price_eur) : 0;
          const discountPerc = tripDetail.discount_value ? parseFloat(tripDetail.discount_value) : 0;
          return {
            val: discountPerc > 0 ? tierPrice * (1 - discountPerc / 100) : tierPrice,
            valEgp: discountPerc > 0 ? tierPriceEgp * (1 - discountPerc / 100) : tierPriceEgp,
            valEur: discountPerc > 0 ? tierPriceEur * (1 - discountPerc / 100) : tierPriceEur,
          };
        };
        const single = getTierPriceObj('single');
        const double = getTierPriceObj('double');
        const triple = getTierPriceObj('triple');

        return {
          label: s.season_label,
          single: single.val,
          double: double.val,
          triple: triple.val,
          singleEgp: single.valEgp,
          doubleEgp: double.valEgp,
          tripleEgp: triple.valEgp,
          singleEur: single.valEur,
          doubleEur: double.valEur,
          tripleEur: triple.valEur,
          singlePrices: { usd: single.val, egp: single.valEgp, eur: single.valEur },
          doublePrices: { usd: double.val, egp: double.valEgp, eur: double.valEur },
          triplePrices: { usd: triple.val, egp: triple.valEgp, eur: triple.valEur },
        };
      });
    })(),
    additionalRooms: {
      seaView: tripDetail.additional_rooms?.sea_view ? parseFloat(tripDetail.additional_rooms.sea_view) : 0,
      poolView: tripDetail.additional_rooms?.pool_view ? parseFloat(tripDetail.additional_rooms.pool_view) : 0,
      seaViewEgp: tripDetail.additional_rooms_egp?.sea_view ? parseFloat(tripDetail.additional_rooms_egp.sea_view) : 0,
      poolViewEgp: tripDetail.additional_rooms_egp?.pool_view ? parseFloat(tripDetail.additional_rooms_egp.pool_view) : 0,
      seaViewEur: tripDetail.additional_rooms_eur?.sea_view ? parseFloat(tripDetail.additional_rooms_eur.sea_view) : 0,
      poolViewEur: tripDetail.additional_rooms_eur?.pool_view ? parseFloat(tripDetail.additional_rooms_eur.pool_view) : 0,
      seaViewPrices: {
        usd: tripDetail.additional_rooms?.sea_view ? parseFloat(tripDetail.additional_rooms.sea_view) : 0,
        egp: tripDetail.additional_rooms_egp?.sea_view ? parseFloat(tripDetail.additional_rooms_egp.sea_view) : 0,
        eur: tripDetail.additional_rooms_eur?.sea_view ? parseFloat(tripDetail.additional_rooms_eur.sea_view) : 0,
      },
      poolViewPrices: {
        usd: tripDetail.additional_rooms?.pool_view ? parseFloat(tripDetail.additional_rooms.pool_view) : 0,
        egp: tripDetail.additional_rooms_egp?.pool_view ? parseFloat(tripDetail.additional_rooms_egp.pool_view) : 0,
        eur: tripDetail.additional_rooms_eur?.pool_view ? parseFloat(tripDetail.additional_rooms_eur.pool_view) : 0,
      },
    },
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
        } catch {
          // Gracefully fallback to link.hotel
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
      .map(t => {
        const discountPerc = t.discount_value ? parseFloat(t.discount_value) : 0;
        const baseUsd = parseFloat(t.base_price) || 0;
        const baseEgp = t.base_price_egp != null ? parseFloat(t.base_price_egp) || 0 : undefined;
        const baseEur = t.base_price_eur != null ? parseFloat(t.base_price_eur) || 0 : undefined;
        return {
          id: t.slug,
          title: t.title,
          description: t.short_description || t.title,
          image: t.image || "/images/home/hero-bg.png",
          location: (t.destinations?.length ? t.destinations.map(d => typeof d === 'string' ? d : (d.name || d.title)).filter(Boolean).join(' · ') : null) || t.location_text || "Egypt",
          price: discountPerc > 0 ? baseUsd * (1 - discountPerc / 100) : baseUsd,
          originalPrice: discountPerc > 0 ? baseUsd : undefined,
          prices: {
            usd: discountPerc > 0 ? baseUsd * (1 - discountPerc / 100) : baseUsd,
            egp: baseEgp != null ? (discountPerc > 0 ? baseEgp * (1 - discountPerc / 100) : baseEgp) : undefined,
            eur: baseEur != null ? (discountPerc > 0 ? baseEur * (1 - discountPerc / 100) : baseEur) : undefined,
          },
          originalPrices: discountPerc > 0 ? {
            usd: baseUsd,
            egp: baseEgp,
            eur: baseEur,
          } : undefined,
          currency: t.currency_code === "USD" ? "$" : t.currency_code,
          duration: t.duration,
          rating: parseFloat(t.rating_avg) || 0,
          reviewCount: t.review_count,
          isFavorite: t.is_favorite,
          priceLabel: t.price_label,
          discountLabel: t.discount_value ? (t.discount_title ? `${t.discount_title} - ${discountPerc}% Off` : `${discountPerc}% Off`) : undefined,
          discountTitle: (t as any).discount_title || undefined,
          discountValue: t.discount_value ? `${discountPerc}% Off` : undefined,
          tags: t.tags?.map(tag => tag.name) || [],
        };
      })
  };
}
