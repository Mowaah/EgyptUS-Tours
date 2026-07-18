import type { Metadata } from "next";
import React, { Suspense } from "react";
import MICE from "@/components/dashboard/Requests/MICE/MICE";

export const metadata: Metadata = {
  title: "MICE & Corporate Requests",
};

export default function MiceCorporatePage() {
  return (
    <Suspense>
      <MICE />
    </Suspense>
  );
}
