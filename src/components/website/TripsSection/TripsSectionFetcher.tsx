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

  const initialTrips: Trip[] = tripsData.map(t => ({
    id: t.slug,
    title: t.title,
    description: t.short_description || t.title,
    image: t.image || "/images/home/hero-bg.png",
    location: t.location_text || "Egypt",
    price: parseFloat(t.base_price) || 0,
    currency: t.currency_code === "USD" ? "$" : t.currency_code,
    duration: t.duration,
    rating: parseFloat(t.rating_avg) || 0,
    reviewCount: t.review_count,
    isFavorite: t.is_favorite,
    priceLabel: t.price_label,
    tags: t.tags?.map(tag => tag.name) || [],
  }));

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
