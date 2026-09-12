import TripsSection from "./TripsSection";
import { getAllTrips } from "@/services/tripsService";
import { getPublicPromotions } from "@/services/promotionsService";
import { hasDesertCategory } from "@/constants";
import { Trip } from "@/types";

interface TripsSectionFetcherProps {
  apiParams: Record<string, string>;
  searchParams?: {
    date?: string;
    destination?: string;
    budget?: string;
    tripType?: string;
    category?: string;
    search?: string;
  };
}

export default async function TripsSectionFetcher({ apiParams, searchParams }: TripsSectionFetcherProps) {
  const [tripsData, promotions] = await Promise.all([
    getAllTrips(apiParams).catch(() => []),
    getPublicPromotions({ applies_to: "trip" }).catch(() => []),
  ]);

  const isDesert = searchParams?.tripType?.toLowerCase() === "desert";
  const isDestAll = searchParams?.destination?.toLowerCase() === "all";
  const isEgyptPage = !isDesert && (!searchParams?.destination || searchParams?.destination?.toLowerCase() === "egypt");

  const filteredTripsData = tripsData.filter((t) => {
    const isDesertTrip = hasDesertCategory(t.tags);

    if (isDesert) {
      return isDesertTrip;
    }

    // Trips with these 4 categories should ONLY exist in tripType=desert
    if (isDesertTrip) {
      return false;
    }

    const hasEgypt = (
      (Array.isArray(t.destinations) && t.destinations.some((d: any) => {
        const slug = (typeof d === "string" ? d : d.slug || "").toLowerCase();
        const name = (typeof d === "string" ? d : d.name || "").toLowerCase();
        return slug === "egypt" || name.includes("egypt");
      })) ||
      (t.location_text || "").toLowerCase().includes("egypt")
    );

    if (isEgyptPage) {
      return hasEgypt;
    }

    if (isDestAll) {
      const hasNonEgyptDest = Array.isArray(t.destinations) && t.destinations.some((d: any) => {
        const slug = (typeof d === "string" ? d : d.slug || "").toLowerCase();
        const name = (typeof d === "string" ? d : d.name || "").toLowerCase();
        return slug !== "egypt" && !name.includes("egypt");
      });
      return hasNonEgyptDest;
    }

    if (searchParams?.tripType && !isDesert) {
      const tt = searchParams.tripType.toLowerCase();
      if (tt.includes("private") && (t as any).offers_private_tour === false) return false;
      if (tt.includes("group") && (t as any).offers_group_tour === false) return false;
    }

    return true;
  });

  const initialTrips: Trip[] = filteredTripsData.map(t => {
    const basePrice = parseFloat(t.base_price) || 0;
    const basePriceEgp = t.base_price_egp != null ? parseFloat(t.base_price_egp) || 0 : undefined;
    const basePriceEur = t.base_price_eur != null ? parseFloat(t.base_price_eur) || 0 : undefined;
    const discountPerc = t.discount_value ? parseFloat(t.discount_value) : 0;
    const discountedPrice = discountPerc > 0 ? basePrice * (1 - discountPerc / 100) : basePrice;

    return {
      id: t.slug,
      numericId: t.id,
      title: t.title,
      description: t.short_description || t.title,
      image: t.image || "/images/home/hero-bg.png",
      location: t.location_text || "Egypt",
      price: discountedPrice,
      prices: {
        usd: discountedPrice,
        egp: basePriceEgp != null ? (discountPerc > 0 ? basePriceEgp * (1 - discountPerc / 100) : basePriceEgp) : undefined,
        eur: basePriceEur != null ? (discountPerc > 0 ? basePriceEur * (1 - discountPerc / 100) : basePriceEur) : undefined,
      },
      originalPrice: discountPerc > 0 ? basePrice : undefined,
      originalPrices: discountPerc > 0 ? {
        usd: basePrice,
        egp: basePriceEgp,
        eur: basePriceEur,
      } : undefined,
      currency: t.currency_code === "USD" ? "$" : t.currency_code,
      duration: t.duration,
      rating: parseFloat(t.rating_avg) || 0,
      reviewCount: t.review_count,
      isFavorite: t.is_favorite,
      priceLabel: t.price_label,
      discountLabel: t.discount_value ? (t.discount_title ? `${t.discount_title} - ${parseFloat(t.discount_value)}% Off` : `${parseFloat(t.discount_value)}% Off`) : undefined,
      discountTitle: t.discount_title || undefined,
      discountValue: t.discount_value ? `${parseFloat(t.discount_value)}% Off` : undefined,
      tags: t.tags?.map(tag => tag.name) || [],
      tagObjects: t.tags?.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        translations: tag.translations,
      })) || [],
      destinations: (t.destinations as any) || [],
    };
  });

  const hasSearch = !!(searchParams?.date || searchParams?.destination || searchParams?.budget || searchParams?.tripType || searchParams?.category);

  return (
    <TripsSection
      variant="page"
      searchParams={hasSearch ? {
        date: searchParams?.date,
        destination: searchParams?.destination,
        budget: searchParams?.budget,
        tripType: searchParams?.tripType,
        category: searchParams?.category,
      } : undefined}
      initialTrips={initialTrips}
      initialPromotions={promotions}
    />
  );
}
