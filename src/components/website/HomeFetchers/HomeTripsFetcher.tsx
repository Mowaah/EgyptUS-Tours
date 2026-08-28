import TripsSection from "@/components/website/TripsSection/TripsSection";
import MultiCountrySection from "@/components/website/MultiCountrySection/MultiCountrySection";
import { getAllTrips } from "@/services/tripsService";
import { Trip } from "@/types";

export default async function HomeTripsFetcher() {
  try {
    const tripsData = await getAllTrips();

    const initialTrips: Trip[] = tripsData.map((t) => ({
      id: t.slug,
      title: t.title,
      description: t.short_description || t.title,
      image: t.image || "/images/home/hero-bg.png",
      location: t.location_text || "Egypt",
      price: parseFloat(t.base_price) || 0,
      currency: t.currency_code === "USD" ? "£" : t.currency_code,
      duration: t.duration,
      rating: parseFloat(t.rating_avg) || 0,
      reviewCount: t.review_count,
      isFavorite: t.is_favorite,
      priceLabel: t.price_label,
      tags: t.tags?.map((tag) => tag.name) || [],
    }));

    return (
      <>
        <TripsSection initialTrips={initialTrips} />
        <MultiCountrySection initialTrips={initialTrips.filter(t => t.tags?.some(tag => tag.toLowerCase().includes("multi country"))).slice(0, 6)} />
      </>
    );
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return null;
  }
}
