import LegalPage from "@/components/website/LegalPage/LegalPage";
import { PRIVACY_DATA } from "@/components/website/LegalPage/legalData";

export const metadata = {
  title: "Privacy and Policy | Egypt Us Tours",
  description: "Learn how we collect, use, and protect your personal information.",
};

export default function Page() {
  return <LegalPage data={PRIVACY_DATA} />;
}
