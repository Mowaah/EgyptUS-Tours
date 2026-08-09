import { redirect } from "next/navigation";

export default function OldDestinationsPage() {
  redirect("/dashboard/catalog/trips/destinations");
}
