import type { Metadata } from "next";
import ContactUs from "@/components/dashboard/Requests/ContactUs/ContactUs";

export const metadata: Metadata = {
  title: "Contact Us Messages",
};

export default function ContactUsPage() {
  return <ContactUs />;
}
