import { Suspense } from "react";
import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seoUtils";
import TransportationPage from "@/components/website/TransportationPage/TransportationPage";
import { getAllVehicles } from "@/services/transportationService";
import { getFaqs } from "@/services/legalHelpService";
import { Vehicle } from "@/components/shared";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    pageKey: "transportation",
    fallbackTitle: "Transportation | Egypt-Us",
    fallbackDescription: "Choose the perfect vehicle for every journey — from city rides to luxury transfers.",
  });
}

export const revalidate = 60;

export default async function Page() {
  const [vehiclesData, faqs] = await Promise.all([
    getAllVehicles(),
    getFaqs()
  ]);
  
  const vehicles: Vehicle[] = vehiclesData.map(v => {
    const basePrice = parseFloat(v.price_amount) || 0;
    const discountPerc = v.discount_value ? parseFloat(v.discount_value) : 0;
    const discountedPrice = discountPerc > 0 ? basePrice * (1 - discountPerc / 100) : basePrice;

    return {
    id: v.slug,
    title: v.title || v.name,
    type: v.type || v.vehicle_type,
    image: v.image || "/images/sedan.png",
    price: discountedPrice.toString(),
    originalPrice: discountPerc > 0 ? basePrice : undefined,
    discountTitle: v.discount_title || undefined,
    discountValue: v.discount_value ? `${parseFloat(v.discount_value)}% Off` : undefined,
    passengers: v.passengers,
    luggage: (v.luggage_capacity !== undefined && v.luggage_capacity !== null && v.luggage_capacity > 0)
      ? `${v.luggage_capacity} large suitcase${v.luggage_capacity > 1 ? "s" : ""}`
      : v.luggage || "Standard",
    durationHours: v.duration_hours_min && v.duration_hours_max
      ? v.duration_hours_min === v.duration_hours_max
        ? `${v.duration_hours_min}`
        : `${v.duration_hours_min}-${v.duration_hours_max}`
      : v.duration_hours_min
      ? `${v.duration_hours_min}`
      : v.duration_hours_max
      ? `${v.duration_hours_max}`
      : undefined,
    description: "",
    rating: parseFloat(v.rating_avg) || 0,
    reviews: v.review_count,
    features: v.features || [],
  };
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransportationPage vehicles={vehicles} faqs={faqs} />
    </Suspense>
  );
}
