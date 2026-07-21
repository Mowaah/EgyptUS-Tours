import FaqPage from "@/components/website/FaqPage/FaqPage";
import { getFaqs } from "@/services/legalHelpService";

export const metadata = {
  title: "FAQ | Egypt Us Tours",
  description: "Frequently Asked Questions about our tours, bookings, and services.",
};

export const revalidate = 60; // Revalidate every minute

export default async function Page() {
  const initialFaqs = await getFaqs();
  return <FaqPage initialFaqs={initialFaqs} />;
}
