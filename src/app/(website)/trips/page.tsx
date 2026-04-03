import TripsSection from "@/components/website/TripsSection/TripsSection";
import FaqSection from "@/components/website/FaqSection/FaqSection";
import BlogsSection from "@/components/website/BlogsSection/BlogsSection";
import type { Metadata } from "next";

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
      />
      <FaqSection />
      <BlogsSection />
    </>
  );
}
