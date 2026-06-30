import ViewHotel from "@/components/dashboard/Bookings/HotelsBookings/ViewHotel/ViewHotel";

export default async function ViewHotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <>
      <ViewHotel bookingId={id} />
    </>
  );
}
