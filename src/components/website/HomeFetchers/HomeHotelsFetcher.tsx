import HotelsSection from "@/components/website/HotelsSection/HotelsSection";
import { getAllHotels } from "@/services/hotelsService";
import { Hotel } from "@/types";

export default async function HomeHotelsFetcher() {
  try {
    const hotelsData = await getAllHotels();

    const initialHotels: Hotel[] = hotelsData.map((h) => {
      const basePrice = parseFloat(h.price_per_night) || 0;
      const discountPerc = h.discount_value ? parseFloat(h.discount_value) : 0;
      const discountedPrice = discountPerc > 0 ? basePrice * (1 - discountPerc / 100) : basePrice;

      return {
      id: h.slug,
      name: h.name,
      location: h.location_text || "Egypt",
      image: h.hero_image || "/images/pyramids.jpg",
      stars: h.stars,
      rating: parseFloat(h.rating_avg) || 0,
      rooms: h.rooms,
      pricePerNight: discountedPrice,
      originalPrice: discountPerc > 0 ? basePrice : undefined,
      discountTitle: h.discount_title || undefined,
      discountValue: h.discount_value ? `${parseFloat(h.discount_value)}% Off` : undefined,
      reviews: h.review_count,
      isFavorite: h.is_favorite || false,
    };
    });

    return <HotelsSection initialHotels={initialHotels} />;
  } catch (error) {
    console.error("Failed to fetch hotels:", error);
    return null;
  }
}
