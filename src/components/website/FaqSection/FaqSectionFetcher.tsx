import FaqSection from "./FaqSection";
import { getFaqs } from "@/services/legalHelpService";

export default async function FaqSectionFetcher() {
  const faqs = await getFaqs();
  return <FaqSection items={faqs && faqs.length > 0 ? faqs : undefined} />;
}
