import LegalPage from "@/components/website/LegalPage/LegalPage";
import { TERMS_DATA } from "@/components/website/LegalPage/legalData";

export const metadata = {
  title: "Terms and Conditions | Egypt Us Tours",
  description: "Read our terms and conditions to understand your rights and responsibilities.",
};

export default function Page() {
  return <LegalPage data={TERMS_DATA} />;
}
