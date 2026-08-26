import { Suspense } from "react";
import ContactPage from "@/components/website/ContactPage/ContactPage";

export const metadata = {
  title: "Contact Us | Egypt-Us",
  description: "Get in touch with us for your next travel adventure in Egypt.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactPage />
    </Suspense>
  );
}
