import DepositsPage from "@/components/dashboard/Finance/Deposits/DepositsPage/DepositsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deposits - Dashboard",
  description: "Track deposit status for all bookings.",
};

export default function DepositsRoute() {
  return <DepositsPage />;
}
