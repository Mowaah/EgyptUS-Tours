import { Suspense } from "react";
import EventsRequestProposalPage from "@/components/website/EventsRequestProposalPage/EventsRequestProposalPage";
import { LoadingSpinner } from "@/components/shared";

export const metadata = {
  title: "Request a Custom Proposal | Egypt-Us",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" variant="fullPage" label="" />}>
      <EventsRequestProposalPage />
    </Suspense>
  );
}
