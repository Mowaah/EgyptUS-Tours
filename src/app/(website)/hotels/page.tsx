import HotelsPageSection from "@/components/website/HotelsPageSection/HotelsPageSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels | Egypt US Tours",
  description:
    "Browse our curated selection of Egypt hotels. Filter by rating, price range, and location to find the perfect stay for your trip.",
};

export default function HotelsPage() {
  return (
    <>
      <HotelsPageSection />
    </>
  );
}
