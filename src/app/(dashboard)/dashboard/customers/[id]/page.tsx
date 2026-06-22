import { Metadata } from "next";
import CustomerProfile from "@/components/dashboard/Customers/CustomerProfile/CustomerProfile";

export const metadata: Metadata = {
  title: "Customer Profile - EgyptUS Tours",
  description: "View customer details and history.",
};

import { Suspense } from "react";

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
  // Pass the ID to the client component to fetch/find the customer
  return <CustomerProfile customerId={params.id} />;
}
