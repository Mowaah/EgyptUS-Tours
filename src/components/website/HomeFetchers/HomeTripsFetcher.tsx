import TripsSection from "@/components/website/TripsSection/TripsSection";
import MultiCountrySection from "@/components/website/MultiCountrySection/MultiCountrySection";
import { getAllTrips } from "@/services/tripsService";
import { Trip } from "@/types";

export default async function HomeTripsFetcher() {
  try {
    const tripsData = await getAllTrips();

    const initialTrips: Trip[] = tripsData.map((t) => {
      const basePrice = parseFloat(t.base_price) || 0;
      const basePriceEgp = t.base_price_egp != null ? parseFloat(t.base_price_egp) || 0 : undefined;
      const basePriceEur = t.base_price_eur != null ? parseFloat(t.base_price_eur) || 0 : undefined;
      const discountPerc = t.discount_value ? parseFloat(t.discount_value) : 0;
      const discountedPrice = discountPerc > 0 ? basePrice * (1 - discountPerc / 100) : basePrice;

      return {
        id: t.slug,
        title: t.title,
        description: t.short_description || t.title,
        image: t.image || "/images/home/hero-bg.png",
        location: t.location_text || "Egypt",
        price: discountedPrice,
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
        currency: t.currency_code === "USD" ? "$" : t.currency_code,
        duration: t.duration,
        rating: parseFloat(t.rating_avg) || 0,
        reviewCount: t.review_count,
        isFavorite: t.is_favorite,
        priceLabel: t.price_label,
        discountLabel: t.discount_value ? (t.discount_title ? `${t.discount_title} - ${parseFloat(t.discount_value)}% Off` : `${parseFloat(t.discount_value)}% Off`) : undefined,
        discountTitle: t.discount_title || undefined,
        discountValue: t.discount_value ? `${parseFloat(t.discount_value)}% Off` : undefined,
        destinations: (t.destinations as any) || [],
        tags: t.tags?.map((tag) => tag.name) || [],
      };
    });

    const egyptTrips = initialTrips.filter((t) => {
      const hasEgypt = (
        (Array.isArray(t.destinations) && t.destinations.some((d: any) => {
          const slug = (typeof d === "string" ? d : d.slug || "").toLowerCase();
          const name = (typeof d === "string" ? d : d.name || "").toLowerCase();
          return slug === "egypt" || name.includes("egypt");
        })) ||
        (t.location || "").toLowerCase().includes("egypt")
      );
      return hasEgypt;
    });

    return (
      <>
        <TripsSection initialTrips={egyptTrips} />
        <MultiCountrySection initialTrips={initialTrips.filter(t => t.tags?.some(tag => tag.toLowerCase().includes("multi country"))).slice(0, 6)} />
      </>
    );
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return null;
  }
}

