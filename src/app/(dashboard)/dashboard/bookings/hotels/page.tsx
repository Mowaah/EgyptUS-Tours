import HotelsBookings from "@/components/dashboard/Bookings/HotelsBookings/HotelsBookings";

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params?.search || "";

  return (
    <>
      <HotelsBookings searchQuery={searchQuery} />
    </>
  );
}
