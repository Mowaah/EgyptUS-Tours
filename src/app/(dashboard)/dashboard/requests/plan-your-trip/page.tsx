import type { Metadata } from "next";
import PlanYourTrip from "@/components/dashboard/Requests/PlanYourTrip/PlanYourTrip";

export const metadata: Metadata = {
  title: "Plan Your Trip Requests",
};

export default function PlanYourTripRequestsPage() {
  return <PlanYourTrip />;
}
