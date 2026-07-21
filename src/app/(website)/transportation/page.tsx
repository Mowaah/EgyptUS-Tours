import { Suspense } from "react";
import TransportationPage from "@/components/website/TransportationPage/TransportationPage";
import { getAllVehicles } from "@/services/transportationService";
import { Vehicle } from "@/components/shared";

export const metadata = {
  title: "Transportation | EgyptUS Tours",
  description: "Choose the perfect vehicle for every journey — from city rides to luxury transfers.",
};

export default async function Page() {
  const backendVehicles = await getAllVehicles();
  
  const vehicles: Vehicle[] = backendVehicles.map(v => ({
    id: v.slug,
    title: v.title || v.name,
    type: v.type || v.vehicle_type,
    image: v.image || "/images/sedan.png",
    price: v.price_amount,
    passengers: v.passengers,
    luggage: v.luggage || "2 bags",
    durationHours: v.duration_hours_min && v.duration_hours_max
      ? `${v.duration_hours_min}-${v.duration_hours_max}`
      : v.duration_hours_min ? `${v.duration_hours_min}+` : undefined,
    description: "",
    rating: parseFloat(v.rating_avg) || 0,
    reviews: v.review_count,
    features: v.features || [],
  }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransportationPage vehicles={vehicles} />
    </Suspense>
  );
}
