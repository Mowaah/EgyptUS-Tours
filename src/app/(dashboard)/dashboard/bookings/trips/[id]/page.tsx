import ViewTrip from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/ViewTrip";

export default async function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ViewTrip tripId={id} />;
}
