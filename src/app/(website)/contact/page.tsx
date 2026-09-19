import { Suspense } from "react";
import ContactPage from "@/components/website/ContactPage/ContactPage";
import { LoadingSpinner } from "@/components/shared";

export const metadata = {
  title: "Contact Us | Egypt-Us",
  description: "Get in touch with us for your next travel adventure in Egypt.",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" variant="fullPage" label="" />}>
      <ContactPage />
    </Suspense>
  );
}
