import TripsSection from "./TripsSection";
import { getAllTrips } from "@/services/tripsService";
import { Trip } from "@/types";

interface TripsSectionFetcherProps {
  apiParams: Record<string, string>;
  searchParams?: {
    date?: string;
    destination?: string;
    budget?: string;
    tripType?: string;
    category?: string;
  };
}

export default async function TripsSectionFetcher({ apiParams, searchParams }: TripsSectionFetcherProps) {
  const tripsData = await getAllTrips(apiParams).catch(() => []);

  const initialTrips: Trip[] = tripsData.map(t => {
    const basePrice = parseFloat(t.base_price) || 0;
    const discountPerc = t.discount_value ? parseFloat(t.discount_value) : 0;
    const discountedPrice = discountPerc > 0 ? basePrice * (1 - discountPerc / 100) : basePrice;

    return {
    id: t.slug,
    title: t.title,
    description: t.short_description || t.title,
    image: t.image || "/images/home/hero-bg.png",
    location: t.location_text || "Egypt",
    price: discountedPrice,
    originalPrice: discountPerc > 0 ? basePrice : undefined,
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
  };
  });

  const hasSearch = !!(searchParams?.date || searchParams?.destination || searchParams?.budget || searchParams?.tripType);

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
    />
  );
}
