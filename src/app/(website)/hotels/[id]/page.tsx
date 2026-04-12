import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HotelDetailPage from "@/components/website/HotelDetailPage/HotelDetailPage";
import { MOCK_HOTEL_DETAIL } from "@/data/hotelDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  // In development, return mock data for any valid-looking id
  const isDemoId = id.startsWith("hotel-") || id === "1" || id === MOCK_HOTEL_DETAIL.id;
  const hotel = isDemoId ? MOCK_HOTEL_DETAIL : null;
  if (!hotel) return { title: "Hotel Not Found" };
  return {
    title: `${hotel.name} | Egypt US Tours`,
    description: hotel.description,
  };
}

export default async function HotelDetailRoutePage({ params }: PageProps) {
  const { id } = await params;
  // In development, return mock data for any valid-looking id
  const isDemoId = id.startsWith("hotel-") || id === "1" || id === MOCK_HOTEL_DETAIL.id;
  const hotel = isDemoId ? MOCK_HOTEL_DETAIL : null;
  if (!hotel) notFound();

  return <HotelDetailPage hotel={hotel} />;
}
