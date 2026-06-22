import PaymentsPage from "@/components/dashboard/Finance/Payments/PaymentsPage/PaymentsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments | EgyptUS Tours",
  description: "Track and manage all payment transactions.",
};

export default function Page() {
  return <PaymentsPage />;
}
