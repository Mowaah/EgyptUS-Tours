import { getAllHotels } from "@/services/hotelsService";
import HotelsPageSection from "@/components/website/HotelsPageSection/HotelsPageSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels | Egypt-Us",
  description:
    "Browse our curated selection of Egypt hotels. Filter by rating, price range, and location to find the perfect stay for your trip.",
};

export default async function HotelsPage() {
  const allHotels = await getAllHotels();

  return (
    <>
      <HotelsPageSection initialHotels={allHotels} />
    </>
  );
}
