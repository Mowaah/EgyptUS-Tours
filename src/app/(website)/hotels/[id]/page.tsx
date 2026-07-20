import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HotelDetailPage from "@/components/website/HotelDetailPage/HotelDetailPage";
import { getHotelBySlug, getAllHotels } from "@/services/hotelsService";
import { Hotel } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const hotel = await getHotelBySlug(id);
    return {
      title: `${hotel.name} | Egypt US Tours`,
      description: hotel.description,
    };
  } catch (error) {
    return { title: "Hotel Not Found" };
  }
}

export default async function HotelDetailRoutePage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const [backendHotel, allHotels] = await Promise.all([
      getHotelBySlug(id),
      getAllHotels()
    ]);
    
    // Get 4 random hotels excluding current one
    const randomHotels = allHotels
      .filter(h => h.slug !== id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map(h => ({
        id: h.slug,
        name: h.name,
        location: h.location_text || "",
        image: h.hero_image || "/images/pyramids.jpg",
        stars: h.stars,
        rating: parseFloat(h.rating_avg) || 0,
        rooms: h.rooms,
        pricePerNight: parseFloat(h.price_per_night) || 0,
        reviews: h.review_count,
        isFavorite: h.is_favorite
      } as Hotel));
    
    // Map backend HotelDetail to frontend Hotel type
    const hotel: Hotel = {
      id: backendHotel.slug,
      name: backendHotel.name,
      location: backendHotel.location_text || "",
      address: backendHotel.address || "",
      image: backendHotel.hero_image || "/images/pyramids.jpg",
      images: [
        backendHotel.hero_image || "/images/pyramids.jpg",
        ...(backendHotel.gallery_images || [])
      ].filter(Boolean) as string[],
      stars: backendHotel.stars,
      rating: parseFloat(backendHotel.rating_avg) || 0,
      rooms: backendHotel.rooms,
      pricePerNight: parseFloat(backendHotel.price_per_night) || 0,
      reviews: backendHotel.review_count,
      description: backendHotel.description,
      isFavorite: backendHotel.is_favorite,
      overview: {
        sections: backendHotel.overview_sections.map(s => ({
          heading: s.title,
          body: s.body
        }))
      },
      facilities: backendHotel.facilities || [],
      mapEmbedUrl: backendHotel.map_embed_url || undefined,
      hotelRooms: (backendHotel.hotel_rooms || []).map(r => ({
        id: r.id.toString(),
        name: r.name,
        description: r.description,
        type: r.type_label || "",
        view: r.view_label || "",
        pricePerNight: parseFloat(r.price_per_night) || 0,
        discountPercent: r.discount_percent,
        features: r.features || [],
        images: (r.images || []).map(img => img.image)
      })),
      hotelReviews: (backendHotel.hotel_reviews || []).map(r => ({
        title: r.title,
        body: r.body,
        author: r.author_name,
        date: new Date(r.review_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        rating: parseFloat(r.rating) || 0
      }))
    };

    return <HotelDetailPage hotel={hotel} similarHotels={randomHotels} />;
  } catch (error) {
    notFound();
  }
}
