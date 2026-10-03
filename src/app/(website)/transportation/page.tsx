import { Suspense } from "react";
import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seoUtils";
import TransportationPage from "@/components/website/TransportationPage/TransportationPage";
import { getAllVehicles } from "@/services/transportationService";
import { getFaqs } from "@/services/legalHelpService";
import { Vehicle, LoadingSpinner } from "@/components/shared";

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
    const parsePrice = (value?: string | null) => value != null ? Number.parseFloat(value) : undefined;
    const basePrice = parsePrice(v.starting_from_price ?? v.starting_from) ?? parsePrice(v.price_amount) ?? 0;
    const basePriceEgp = parsePrice(v.starting_from_price_egp) ?? parsePrice(v.price_amount_egp);
    const basePriceEur = parsePrice(v.starting_from_price_eur) ?? parsePrice(v.price_amount_eur);
    const hasPromotion = Boolean(v.discount_value && Number.parseFloat(v.discount_value) > 0);
    const discountedPrice = hasPromotion
      ? parsePrice(v.discounted_starting_from_price) ?? basePrice
      : basePrice;
    const discountedPriceEgp = hasPromotion
      ? parsePrice(v.discounted_starting_from_price_egp) ?? basePriceEgp
      : basePriceEgp;
    const discountedPriceEur = hasPromotion
      ? parsePrice(v.discounted_starting_from_price_eur) ?? basePriceEur
      : basePriceEur;

    return {
      id: v.slug,
      title: v.title || v.name,
      type: v.category || v.type || v.vehicle_type,
      image: v.image || "/images/sedan.png",
      price: discountedPrice.toString(),
      prices: {
        usd: discountedPrice,
        egp: discountedPriceEgp,
        eur: discountedPriceEur,
      },
      originalPrice: hasPromotion ? basePrice : undefined,
      originalPrices: hasPromotion ? {
        usd: basePrice,
        egp: basePriceEgp,
        eur: basePriceEur,
      } : undefined,
      discountTitle: v.discount_title || undefined,
      discountValue: hasPromotion ? `${parseFloat(v.discount_value!)}% Off` : undefined,
      passengers: v.passengers,
      luggage: (v.luggage_capacity !== undefined && v.luggage_capacity !== null && v.luggage_capacity > 0)
        ? `${v.luggage_capacity} large suitcase${v.luggage_capacity > 1 ? "s" : ""}`
        : v.luggage || "Standard",
      description: (v as any).short_description || (v as any).description || "",
      rating: parseFloat(v.rating_avg) || 0,
      reviews: v.review_count,
      features: v.features || [],
  };
  });

  return (
    <Suspense fallback={<LoadingSpinner size="lg" variant="fullPage" label="" />}>
      <TransportationPage vehicles={vehicles} faqs={faqs} />
    </Suspense>
  );
}
