import { Suspense } from "react";
import PlanYourTripPage from "@/components/website/PlanYourTripPage/PlanYourTripPage";
import { LoadingSpinner } from "@/components/shared";

export default function BookingPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" variant="fullPage" label="" />}>
      <PlanYourTripPage />
    </Suspense>
  );
}

