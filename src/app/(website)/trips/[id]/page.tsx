import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TripDetailPage from "@/components/website/TripDetailPage/TripDetailPage";
import { mockTripDetail } from "@/lib/mockTripDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  // In development, return mock data for any valid-looking id
  const isDemoId = id.startsWith("trip-") || id === mockTripDetail.id;
  const trip = isDemoId ? mockTripDetail : null;
  if (!trip) return { title: "Trip Not Found" };
  return {
    title: `${trip.title} | Egypt US Tours`,
    description: trip.description,
  };
}

export default async function TripDetailRoutePage({ params }: PageProps) {
  const { id } = await params;
  // In development, return mock data for any valid-looking id
  const isDemoId = id.startsWith("trip-") || id === mockTripDetail.id;
  const trip = isDemoId ? mockTripDetail : null;
  if (!trip) notFound();

  return <TripDetailPage trip={trip} />;
}
