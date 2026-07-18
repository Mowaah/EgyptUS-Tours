import React from "react";
import ViewMiceRequest from "@/components/dashboard/Requests/MICE/ViewMiceRequest/ViewMiceRequest";

export default function ViewMiceRequestPage({ params }: { params: { id: string } }) {
  return <ViewMiceRequest requestId={params.id} />;
}
