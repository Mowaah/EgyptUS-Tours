import { Suspense } from "react";
import BookPrivateTripPage from "@/components/website/BookPrivateTripPage/BookPrivateTripPage";
import { notFound } from "next/navigation";
import { getFullTripById } from "@/services/tripsService";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookGroupTrip({ params }: PageProps) {
  const { id } = await params;

  const trip = await getFullTripById(id);

  if (!trip) {
    notFound();
  }

  return (
    <Suspense fallback={<div style={{ minHeight: "60vh", padding: "100px 20px", textAlign: "center" }}>Loading booking...</div>}>
      <BookPrivateTripPage trip={trip} isGroupTrip={true} />
    </Suspense>
  );
}
