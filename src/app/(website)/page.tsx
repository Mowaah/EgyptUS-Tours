import HeroSection from "@/components/website/HeroSection/HeroSection";
import StatsBar from "@/components/website/StatsBar/StatsBar";
import TripsSection from "@/components/website/TripsSection/TripsSection";
import MultiCountrySection from "@/components/website/MultiCountrySection/MultiCountrySection";
import HotelsSection from "@/components/website/HotelsSection/HotelsSection";
import DesertSection from "@/components/website/DesertSection/DesertSection";
import MiceSection from "@/components/website/MiceSection/MiceSection";
import CtaBanner from "@/components/website/CtaBanner/CtaBanner";
import StatsSection from "@/components/website/StatsSection/StatsSection";
import TransportationSection from "@/components/website/TransportationSection/TransportationSection";
import B2BSection from "@/components/website/B2BSection/B2BSection";
import DesertBannerSection from "@/components/website/DesertBannerSection/DesertBannerSection";
import WhyChooseUsSection from "@/components/website/WhyChooseUsSection/WhyChooseUsSection";
import TestimonialsSection from "@/components/website/TestimonialsSection/TestimonialsSection";
import ContactSection from "@/components/website/ContactSection/ContactSection";
import { getAllTrips } from "@/services/tripsService";
import { getAllHotels } from "@/services/hotelsService";
import { getAllVehicles } from "@/services/transportationService";
import { getTestimonials } from "@/services/testimonialsService";
import { Trip, Hotel } from "@/types";

export default async function Home() {
  const [backendTrips, backendHotels, backendVehicles, backendTestimonials] = await Promise.all([
    getAllTrips(),
    getAllHotels(),
    getAllVehicles(),
    getTestimonials(),
  ]);

  const initialTrips: Trip[] = backendTrips.map((t) => ({
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
    tags: t.tags?.map((tag) => tag.name) || [],
  }));

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

  const initialVehicles = backendVehicles.map((v) => ({
    id: v.slug,
    name: v.name || v.title,
    passengers: `1-${v.passengers} passengers`,
  }));

  return (
    <>
      <HeroSection />
      <StatsBar />
      <TripsSection initialTrips={initialTrips} />
      <MultiCountrySection initialTrips={initialTrips.slice(0, 6)} />
      <HotelsSection initialHotels={initialHotels} />
      <DesertSection />
      <MiceSection />
      <CtaBanner />
      <StatsSection />
      <TransportationSection initialVehicles={initialVehicles} />
      <B2BSection />
      <DesertBannerSection />
      <WhyChooseUsSection />
      <TestimonialsSection initialTestimonials={backendTestimonials} />
      <ContactSection />
    </>
  );
}
