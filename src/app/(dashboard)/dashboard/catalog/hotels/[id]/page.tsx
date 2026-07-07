import { redirect } from "next/navigation";

export default async function HotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/catalog/hotels/${id}/overview`);
}
