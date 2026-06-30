import ViewTransportation from "@/components/dashboard/Bookings/TransportationBookings/ViewTransportation/ViewTransportation";

export default async function ViewTransportationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <ViewTransportation id={resolvedParams.id} />;
}
