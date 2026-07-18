import type { Metadata } from "next";
import ViewPlanYourTrip from "@/components/dashboard/Requests/PlanYourTrip/ViewPlanYourTrip/ViewPlanYourTrip";

export const metadata: Metadata = {
  title: "Plan Your Trip Request Details",
};

export default async function ViewPlanYourTripPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ViewPlanYourTrip requestId={resolvedParams.id} />;
}
