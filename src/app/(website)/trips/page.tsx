import TripsSection from "@/components/website/TripsSection/TripsSection";
import FaqSection from "@/components/website/FaqSection/FaqSection";
import BlogsSection from "@/components/website/BlogsSection/BlogsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trips | Egypt US Tours",
  description:
    "Browse our handpicked collection of Egypt tours. Filter by duration, special offers, and price range to find your perfect adventure.",
};

export default function TripsPage() {
  return (
    <>
      <TripsSection variant="page" />
      <FaqSection />
      <BlogsSection />
    </>
  );
}
