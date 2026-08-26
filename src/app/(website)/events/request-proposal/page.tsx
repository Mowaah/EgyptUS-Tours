import { Suspense } from "react";
import EventsRequestProposalPage from "@/components/website/EventsRequestProposalPage/EventsRequestProposalPage";

export const metadata = {
  title: "Request a Custom Proposal | Egypt-Us",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsRequestProposalPage />
    </Suspense>
  );
}
