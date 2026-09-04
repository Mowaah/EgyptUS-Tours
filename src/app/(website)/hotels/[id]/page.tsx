import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HotelDetailPage from "@/components/website/HotelDetailPage/HotelDetailPage";
import { getHotelBySlug, getAllHotels, mapHotelDetailToHotel } from "@/services/hotelsService";
import { Hotel } from "@/types";
import { generateDynamicSeoMetadata } from "@/lib/seoUtils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const hotel = await getHotelBySlug(id);
    return generateDynamicSeoMetadata(hotel, "hotels", "Hotel Details");
  } catch (error) {
    return { title: "Hotel Not Found" };
  }
}

export default async function HotelDetailRoutePage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const [hotelDetail, allHotels] = await Promise.all([
      getHotelBySlug(id),
      getAllHotels()
    ]);
    
    // Get 4 random hotels excluding current one
    const randomHotels = allHotels
      .filter(h => h.slug !== id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map(h => {
        const baseUsd = parseFloat(h.price_per_night) || 0;
        const baseEgp = h.price_per_night_egp ? parseFloat(h.price_per_night_egp) : undefined;
        const baseEur = h.price_per_night_eur ? parseFloat(h.price_per_night_eur) : undefined;
        return {
          id: h.slug,
          name: h.name,
          location: h.location_text || "",
          image: h.hero_image || "/images/pyramids.jpg",
          stars: h.stars,
          rating: parseFloat(h.rating_avg) || 0,
          rooms: h.rooms,
          pricePerNight: baseUsd,
          pricePerNightEgp: baseEgp,
          pricePerNightEur: baseEur,
          prices: {
            usd: baseUsd,
            egp: baseEgp,
            eur: baseEur,
          },
          reviews: h.review_count,
          isFavorite: h.is_favorite,
        } as Hotel;
      });
    
    // Map HotelDetail to frontend Hotel type
    const hotel: Hotel = mapHotelDetailToHotel(hotelDetail);

    return <HotelDetailPage hotel={hotel} similarHotels={randomHotels} />;
  } catch (error) {
    notFound();
  }
}
