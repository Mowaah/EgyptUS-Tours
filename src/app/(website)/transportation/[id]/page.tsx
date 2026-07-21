import TransportationDetailPage from "@/components/website/TransportationDetailPage/TransportationDetailPage";
import { getVehicleBySlug } from "@/services/transportationService";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const vehicle = await getVehicleBySlug(id);
    return {
      title: `${vehicle.name} | EgyptUS Tours`,
      description: vehicle.description || `Book your ${vehicle.name} with EgyptUS Tours.`,
    };
  } catch (error) {
    return { title: "Vehicle Not Found" };
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const backendVehicle = await getVehicleBySlug(id);
    
    // Pass backendVehicle to TransportationDetailPage which will map it to frontend type
    return <TransportationDetailPage backendVehicle={backendVehicle} />;
  } catch (error) {
    return <div>Vehicle Not Found</div>;
  }
}
