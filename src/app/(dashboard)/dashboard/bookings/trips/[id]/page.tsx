import ViewTrip from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/ViewTrip";

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  return <ViewTrip tripId={params.id} />;
}
