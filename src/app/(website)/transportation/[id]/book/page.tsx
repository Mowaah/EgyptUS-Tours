import BookTransportationPage from "@/components/website/BookTransportationPage/BookTransportationPage";
import { Vehicle } from "@/types";
import { getVehicleBySlug } from "@/services/transportationService";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookTransportationRoute({ params }: Props) {
  const { id } = await params;
  
  try {
    const detail = await getVehicleBySlug(id);
    const vehicle: Vehicle = {
      id: detail.slug || id,
      name: detail.name || detail.title || "",
      type: detail.vehicle_type || detail.type || "Premium Vehicle",
      image: detail.image || "/images/sedan.png",
      gallery: detail.gallery?.map(g => g.image) || [],
      price: `$${detail.price_amount || detail.price || "0"}`,
      passengers: detail.passengers || 4,
      luggage: typeof detail.luggage === "number" ? detail.luggage : parseInt(detail.luggage || "2", 10),
      description: detail.description || "",
      rating: parseFloat(detail.rating_avg) || 0,
      reviews: detail.review_count || 0,
    };

    return <BookTransportationPage vehicle={vehicle} />;
  } catch (error) {
    return <div>Vehicle Not Found</div>;
  }
}
