import { Suspense } from "react";
import BookPrivateTripPage from "@/components/website/BookPrivateTripPage/BookPrivateTripPage";
import { notFound } from "next/navigation";
import { getFullTripById } from "@/services/tripsService";
import { LoadingSpinner } from "@/components/shared";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPrivateTrip({ params }: PageProps) {
  const { id } = await params;

  const trip = await getFullTripById(id);

  if (!trip) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSpinner size="lg" variant="fullPage" label="" />}>
      <BookPrivateTripPage trip={trip} />
    </Suspense>
  );
}
