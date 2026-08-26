import type { Metadata } from "next";
import { Suspense } from "react";
import TripsSectionFetcher from "@/components/website/TripsSection/TripsSectionFetcher";
import FaqSectionFetcher from "@/components/website/FaqSection/FaqSectionFetcher";
import BlogsSectionFetcher from "@/components/website/BlogsSection/BlogsSectionFetcher";

export const metadata: Metadata = {
  title: "Trips | Egypt US Tours",
  description:
    "Browse our handpicked collection of Egypt tours. Filter by duration, special offers, and price range to find your perfect adventure.",
};

export const revalidate = 60;

interface TripsPageProps {
  searchParams: Promise<{
    date?: string;
    destination?: string;
    budget?: string;
    tripType?: string;
    category?: string;
  }>;
}

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const params = await searchParams;

  const apiParams: Record<string, string> = {};
  if (params.destination && params.destination.toLowerCase() !== "all") {
    apiParams.search = params.destination;
  } else if (params.tripType && params.tripType.toLowerCase() !== "desert") {
    apiParams.category = params.tripType;
  }


  return (
    <>
      <Suspense fallback={
        <div style={{ padding: "10rem 2rem", textAlign: "center", color: "#666" }}>
          Loading trips...
        </div>
      }>
        <TripsSectionFetcher apiParams={apiParams} searchParams={params} />
      </Suspense>

      <Suspense fallback={
        <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#666" }}>
          Loading FAQs...
        </div>
      }>
        <FaqSectionFetcher />
      </Suspense>

      <Suspense fallback={
        <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#666" }}>
          Loading Blogs...
        </div>
      }>
        <BlogsSectionFetcher />
      </Suspense>
    </>
  );
}
