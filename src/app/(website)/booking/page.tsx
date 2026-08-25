import { Suspense } from "react";
import PlanYourTripPage from "@/components/website/PlanYourTripPage/PlanYourTripPage";

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlanYourTripPage />
    </Suspense>
  );
}

