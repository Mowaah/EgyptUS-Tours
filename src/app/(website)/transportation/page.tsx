import { Suspense } from "react";
import TransportationPage from "@/components/website/TransportationPage/TransportationPage";
import { getAllVehicles } from "@/services/transportationService";
import { getFaqs } from "@/services/legalHelpService";
import { Vehicle } from "@/components/shared";

export const metadata = {
  title: "Transportation | EgyptUS Tours",
  description: "Choose the perfect vehicle for every journey — from city rides to luxury transfers.",
};

export const revalidate = 60;

export default async function Page() {
  const [vehiclesData, faqs] = await Promise.all([
    getAllVehicles(),
    getFaqs()
  ]);
  
  const vehicles: Vehicle[] = vehiclesData.map(v => ({
    id: v.slug,
    title: v.title || v.name,
    type: v.type || v.vehicle_type,
    image: v.image || "/images/sedan.png",
    price: v.price_amount,
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
  }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransportationPage vehicles={vehicles} faqs={faqs} />
    </Suspense>
  );
}
