import TripsSection from "@/components/website/TripsSection/TripsSection";
import FaqSection from "@/components/website/FaqSection/FaqSection";
import BlogsSection from "@/components/website/BlogsSection/BlogsSection";
import type { Metadata } from "next";
import { getAllTrips } from "@/services/tripsService";
import { getLatestBlogs } from "@/services/blogsService";
import { Trip, Blog } from "@/types";

export const metadata: Metadata = {
  title: "Trips | Egypt US Tours",
  description:
    "Browse our handpicked collection of Egypt tours. Filter by duration, special offers, and price range to find your perfect adventure.",
};

interface TripsPageProps {
  searchParams: Promise<{
    date?: string;
    destination?: string;
    budget?: string;
    tripType?: string;
  }>;
}

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const params = await searchParams;
  const hasSearch = !!(params.date || params.destination || params.budget || params.tripType);

  const apiParams: Record<string, string> = {};
  if (params.destination) apiParams.search = params.destination;

  const [backendTrips, latestBlogsApi] = await Promise.all([
    getAllTrips(apiParams),
    getLatestBlogs(),
  ]);

  const initialTrips: Trip[] = backendTrips.map(t => ({
    id: t.slug,
    title: t.title,
    description: t.short_description || t.title,
    image: t.image || "/images/home/hero-bg.png",
    location: t.location_text || "Egypt",
    price: parseFloat(t.base_price) || 0,
    currency: t.currency_code === "USD" ? "$" : t.currency_code,
    duration: t.duration,
    rating: parseFloat(t.rating_avg) || 0,
    reviewCount: t.review_count,
    isFavorite: t.is_favorite,
    priceLabel: t.price_label,
    tags: t.tags?.map(tag => tag.name) || [],
  }));

  const initialBlogs: Blog[] = (latestBlogsApi || []).slice(0, 4).map(b => ({
    id: b.slug || String(b.id),
    category: b.category?.name || b.category_label || "Blog",
    categoryColor: (b.category_color === "orange" ? "orange" : "blue") as "blue" | "orange",
    title: b.title,
    excerpt: b.excerpt || b.subtitle || "",
    date: new Date(b.published_at || b.date).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" }),
    image: b.hero_image || b.featured_image || "/images/home/hero-bg.png",
  }));

  return (
    <>
      <TripsSection
        variant="page"
        searchParams={hasSearch ? {
          date: params.date,
          destination: params.destination,
          budget: params.budget,
          tripType: params.tripType,
        } : undefined}
        initialTrips={initialTrips}
      />
      <FaqSection />
      <BlogsSection blogs={initialBlogs} />
    </>
  );
}
