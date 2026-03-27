import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TripDetailPage from "@/components/website/TripDetailPage/TripDetailPage";
import { mockTripDetail } from "@/lib/mockTripDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  // In production, fetch trip by id. For now, use mock if id matches.
  const trip = id === mockTripDetail.id ? mockTripDetail : null;
  if (!trip) return { title: "Trip Not Found" };
  return {
    title: `${trip.title} | Egypt US Tours`,
    description: trip.description,
  };
}

export default async function TripDetailRoutePage({ params }: PageProps) {
  const { id } = await params;
  // In production, fetch trip by id
  const trip = id === mockTripDetail.id ? mockTripDetail : null;
  if (!trip) notFound();

  return <TripDetailPage trip={trip} />;
}
