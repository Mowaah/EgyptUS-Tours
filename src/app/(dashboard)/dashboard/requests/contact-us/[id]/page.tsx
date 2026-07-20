import type { Metadata } from "next";
import ViewContactUsRequest from "@/components/dashboard/Requests/ContactUs/ViewContactUsRequest";

export const metadata: Metadata = {
  title: "Contact Us Message Details",
};

export default async function ViewContactUsRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ViewContactUsRequest requestId={resolvedParams.id} />;
}
