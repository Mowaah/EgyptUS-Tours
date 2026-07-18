import React from "react";
import ViewMiceRequest from "@/components/dashboard/Requests/MICE/ViewMiceRequest/ViewMiceRequest";

export default async function ViewMiceRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ViewMiceRequest requestId={resolvedParams.id} />;
}
