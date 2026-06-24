import { Metadata } from "next";
import ViewLead from "@/components/dashboard/LeadsInquiries/ViewLead/ViewLead";

export const metadata: Metadata = {
  title: "View Lead - EgyptUS Tours",
  description: "View lead details and activity timeline.",
};

export default async function ViewLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  // Pass the ID to the client component to fetch/find the lead
  return <ViewLead leadId={resolvedParams.id} />;
}
