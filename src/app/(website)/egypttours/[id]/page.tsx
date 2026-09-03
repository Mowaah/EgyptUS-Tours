import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TripDetailPage from "@/components/website/TripDetailPage/TripDetailPage";
import { getTripById, getAllTrips, getFullTripById } from "@/services/tripsService";
import { getTestimonials } from "@/services/testimonialsService";
import { generateDynamicSeoMetadata } from "@/lib/seoUtils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await getTripById(id);
  return generateDynamicSeoMetadata(trip, "trips", "Trip Details");
}

export default async function TripDetailRoutePage({ params }: PageProps) {
  const { id } = await params;

  const [relatedTripsData, testimonials] = await Promise.all([
    getAllTrips(),
    getTestimonials({ category: 'trip' })
  ]);

  const trip = await getFullTripById(id, relatedTripsData);
  if (!trip) {
    notFound();
  }

  return <TripDetailPage trip={trip} testimonials={testimonials} />;
}
