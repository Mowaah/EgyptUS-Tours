import TransportationBookings from "@/components/dashboard/Bookings/TransportationBookings/TransportationBookings";

export default async function TransportationBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params?.search || "";

  return (
    <>
      <TransportationBookings searchQuery={searchQuery} />
    </>
  );
}
