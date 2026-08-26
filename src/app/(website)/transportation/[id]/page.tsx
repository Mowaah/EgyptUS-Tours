import TransportationDetailPage from "@/components/website/TransportationDetailPage/TransportationDetailPage";
import { getVehicleBySlug } from "@/services/transportationService";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const vehicle = await getVehicleBySlug(id);
    return {
      title: `${vehicle.name} | Egypt-Us`,
      description: vehicle.description || `Book your ${vehicle.name} with Egypt-Us.`,
    };
  } catch (error) {
    return { title: "Vehicle Not Found" };
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const vehicleDetail = await getVehicleBySlug(id);
    
    return <TransportationDetailPage vehicleDetail={vehicleDetail} />;
  } catch (error) {
    return <div>Vehicle Not Found</div>;
  }
}
