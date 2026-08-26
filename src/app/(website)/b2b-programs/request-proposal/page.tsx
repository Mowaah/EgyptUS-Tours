import { Suspense } from "react";
import B2BRequestProposalPage from "@/components/website/B2BRequestProposalPage/B2BRequestProposalPage";

export const metadata = {
  title: "Request a Corporate Proposal | Egypt-Us",
  description: "Share your requirements and we'll create a tailored proposal for your organization.",
};

export default function RequestProposal() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <B2BRequestProposalPage />
    </Suspense>
  );
}
