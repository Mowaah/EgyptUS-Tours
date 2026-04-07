import BookPrivateTripPage from "@/components/website/BookPrivateTripPage/BookPrivateTripPage";
import { notFound } from "next/navigation";
import { mockTripDetail } from "@/lib/mockTripDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPrivateTrip({ params }: PageProps) {
  const { id } = await params;

  const trip = id === mockTripDetail.id ? mockTripDetail : null;

  if (!trip) {
    notFound();
  }

  return <BookPrivateTripPage trip={trip} />;
}
