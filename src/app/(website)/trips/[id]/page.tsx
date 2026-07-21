import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TripDetailPage from "@/components/website/TripDetailPage/TripDetailPage";
import { getTripById, getAllTrips } from "@/services/tripsService";
import { getTestimonials, BackendTestimonial } from "@/services/testimonialsService";
import { Trip } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await getTripById(id);
  if (!trip) return { title: "Trip Not Found" };
  return {
    title: `${trip.title} | Egypt US Tours`,
    description: trip.description || trip.short_description,
  };
}

export default async function TripDetailRoutePage({ params }: PageProps) {
  const { id } = await params;
  
  const [backendTrip, relatedTripsData, backendTestimonials] = await Promise.all([
    getTripById(id),
    getAllTrips(),
    getTestimonials({ category: 'trip' })
  ]);
  
  if (!backendTrip) {
    notFound();
  }

  // Fallback to mockTripDetail's empty fields for the sake of the type, 
  // but fill with real data where available.
  const trip: Trip = {
    id: backendTrip.slug,
    title: backendTrip.title,
    description: backendTrip.description || backendTrip.short_description,
    image: backendTrip.image || "/images/pyramids4.jpg",
    images: backendTrip.images?.length ? backendTrip.images : ["/images/pyramids4.jpg"],
    location: backendTrip.location_text || "Egypt",
    price: parseFloat(backendTrip.base_price) || 0,
    currency: backendTrip.currency_code === "USD" ? "$" : backendTrip.currency_code,
    priceLabel: backendTrip.price_label,
    duration: backendTrip.duration,
    rating: parseFloat(backendTrip.rating_avg) || 0,
    reviewCount: backendTrip.review_count,
    isFavorite: backendTrip.is_favorite,
    tags: backendTrip.tags?.map(t => t.name) || [],
    privatePrice: backendTrip.private_price ? parseFloat(backendTrip.private_price) : undefined,
    groupPrice: backendTrip.group_price ? parseFloat(backendTrip.group_price) : undefined,
    overview: backendTrip.overview ? {
      description: backendTrip.overview.description,
      culturalValue: backendTrip.overview.cultural_value,
      whoIsItFor: backendTrip.overview.who_is_it_for,
    } : { description: "", culturalValue: "", whoIsItFor: "" },
    included: backendTrip.included || [],
    excluded: backendTrip.excluded || [],
    itinerary: (backendTrip.itinerary || []).map(day => ({
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
    availability: (backendTrip.availability || []).map(slot => ({
      dates: `${slot.start_date} - ${slot.end_date}`,
      duration: `${backendTrip.duration.days} Days / ${backendTrip.duration.nights} Nights`,
      spotsLeft: slot.capacity_remaining,
      totalSpots: slot.capacity_total,
    })),
    vipExperiences: (backendTrip.vip_experiences || []).map(vip => ({
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
    importantLinks: (backendTrip.important_links || []).map(link => ({
      label: link.label,
      href: link.href,
    })),
    pricing: (backendTrip.pricing || []).map(season => ({
      season: season.season_label,
      tiers: (season.tiers || []).map(tier => ({
        label: tier.label,
        price: parseFloat(tier.price) || 0,
      }))
    })),
    travelerPhotos: backendTrip.traveler_photos || [],
    hotels: (backendTrip.hotels || []).map(link => ({
      name: link.hotel.name,
      location: link.hotel.location_text,
      description: "", // minimal serializer doesn't have it
      image: link.hotel.hero_image || "/images/accommodation/accomodation3.jpg",
      photos: link.hotel.hero_image ? [link.hotel.hero_image] : [],
      rating: 0,
      reviewCount: 0,
      amenities: [],
    })),
    reviews: (backendTrip.trip_reviews || []).map(r => ({
      image: "/images/testimonials/marcus.jpg",
      name: r.author_name,
      location: r.author_country || "Unknown",
      quote: r.body,
      rating: parseFloat(r.rating) || 0,
    })),
    relatedTrips: relatedTripsData
      .filter(t => t.id !== backendTrip.id) // exclude current trip
      .slice(0, 4)
      .map(t => ({
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
      }))
  };

  return <TripDetailPage trip={trip} testimonials={backendTestimonials} />;
}
