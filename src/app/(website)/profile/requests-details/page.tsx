import { Suspense } from "react";
import type { Metadata } from "next";
import ProfileRequestDetailsPage from "@/components/website/ProfileRequestDetailsPage/ProfileRequestDetailsPage";

export const metadata: Metadata = {
  title: "Request Details | Egypt US Tours",
  description: "View your event request details and proposal status.",
};

export default function RequestDetails() {
  return (
    <Suspense fallback={null}>
      <ProfileRequestDetailsPage />
    </Suspense>
  );
}
