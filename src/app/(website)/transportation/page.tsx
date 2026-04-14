import { Suspense } from "react";
import TransportationPage from "@/components/website/TransportationPage/TransportationPage";

export const metadata = {
  title: "Transportation | EgyptUS Tours",
  description: "Choose the perfect vehicle for every journey — from city rides to luxury transfers.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransportationPage />
    </Suspense>
  );
}
