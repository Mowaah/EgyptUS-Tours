import TripsBookings from "@/components/dashboard/Bookings/TripsBookings/TripsBookings";

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params?.search || "";

  return (
    <>
      <TripsBookings searchQuery={searchQuery} />
    </>
  );
}
