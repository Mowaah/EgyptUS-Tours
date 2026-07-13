import { redirect } from "next/navigation";

export default async function TransportationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/catalog/transportation/${id}/overview`);
}
