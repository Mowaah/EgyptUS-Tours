import TransportationSection from "@/components/website/TransportationSection/TransportationSection";
import { getAllVehicles } from "@/services/transportationService";

export default async function HomeTransportationFetcher() {
  try {
    const backendVehicles = await getAllVehicles();

    const initialVehicles = backendVehicles.map((v) => ({
      id: v.slug,
      name: v.name || v.title,
      passengers: `1-${v.passengers} passengers`,
    }));

    return <TransportationSection initialVehicles={initialVehicles} />;
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return null;
  }
}
