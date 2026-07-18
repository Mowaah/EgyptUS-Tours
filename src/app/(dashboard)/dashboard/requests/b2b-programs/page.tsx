import type { Metadata } from "next";
import B2B from "@/components/dashboard/Requests/B2B/B2B";

export const metadata: Metadata = {
  title: "B2B Programs Requests",
};

export default function B2BProgramsPage() {
  return <B2B />;
}
