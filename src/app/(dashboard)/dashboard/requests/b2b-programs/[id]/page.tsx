import type { Metadata } from "next";
import ViewB2BRequest from "@/components/dashboard/Requests/B2B/ViewB2BRequest/ViewB2BRequest";

export const metadata: Metadata = {
  title: "B2B Program Request Details",
};

export default async function ViewB2BRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ViewB2BRequest requestId={resolvedParams.id} />;
}
