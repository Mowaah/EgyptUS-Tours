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
    const discountPerc = parseFloat(detail.discount_value || "0");
    const basePrice = parseFloat(detail.price_amount || detail.price || "0");
    const basePriceEgp = detail.price_amount_egp ? parseFloat(detail.price_amount_egp) : undefined;
    const basePriceEur = detail.price_amount_eur ? parseFloat(detail.price_amount_eur) : undefined;
    const discountedPrice = discountPerc > 0 ? basePrice * (1 - discountPerc / 100) : basePrice;

    const vehicle: Vehicle = {
      id: detail.slug || id,
      name: detail.name || detail.title || "",
      title: detail.title || detail.name || "",
      type: detail.vehicle_type || detail.type || "Premium Vehicle",
      image: detail.image || "/images/sedan.png",
      gallery: detail.gallery?.map(g => g.image) || [],
      price: discountedPrice.toString(),
      prices: {
        usd: discountedPrice,
        egp: basePriceEgp != null ? (discountPerc > 0 ? basePriceEgp * (1 - discountPerc / 100) : basePriceEgp) : undefined,
        eur: basePriceEur != null ? (discountPerc > 0 ? basePriceEur * (1 - discountPerc / 100) : basePriceEur) : undefined,
      },
      originalPrice: discountPerc > 0 ? basePrice : undefined,
      originalPrices: discountPerc > 0 ? {
        usd: basePrice,
        egp: basePriceEgp,
        eur: basePriceEur,
      } : undefined,
      discountTitle: detail.discount_title || undefined,
      discountValue: detail.discount_value ? `${parseFloat(detail.discount_value)}% Off` : undefined,
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
