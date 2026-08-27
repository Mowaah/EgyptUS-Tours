import { getAllHotels } from "@/services/hotelsService";
import HotelsPageSection from "@/components/website/HotelsPageSection/HotelsPageSection";
import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seoUtils";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    pageKey: "hotels",
    fallbackTitle: "Hotels | Egypt-Us",
    fallbackDescription: "Browse our curated selection of Egypt hotels. Filter by rating, price range, and location to find the perfect stay for your trip.",
  });
}

export default async function HotelsPage() {
  const allHotels = await getAllHotels();

  return (
    <>
      <HotelsPageSection initialHotels={allHotels} />
    </>
  );
}
