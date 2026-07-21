import HotelsSection from "@/components/website/HotelsSection/HotelsSection";
import { getAllHotels } from "@/services/hotelsService";
import { Hotel } from "@/types";

export default async function HomeHotelsFetcher() {
  try {
    const backendHotels = await getAllHotels();

    const initialHotels: Hotel[] = backendHotels.map((h) => ({
      id: h.slug,
      name: h.name,
      location: h.location_text || "Egypt",
      image: h.hero_image || "/images/pyramids.jpg",
      stars: h.stars,
      rating: parseFloat(h.rating_avg) || 0,
      rooms: h.rooms,
      pricePerNight: parseFloat(h.price_per_night) || 0,
      reviews: h.review_count,
      isFavorite: h.is_favorite || false,
    }));

    return <HotelsSection initialHotels={initialHotels} />;
  } catch (error) {
    console.error("Failed to fetch hotels:", error);
    return null;
  }
}
