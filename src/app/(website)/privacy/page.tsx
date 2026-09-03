import LegalPage from "@/components/website/LegalPage/LegalPage";
import { LegalSection } from "@/components/website/LegalPage/legalData";
import { getPrivacy } from "@/services/legalHelpService";

export const metadata = {
  title: "Privacy Policy | Egypt-Us",
  description: "Learn how we collect, use, and protect your personal information.",
};

export const revalidate = 60;

export default async function Page() {
  const privacyData = await getPrivacy();

  const sections: LegalSection[] = privacyData.map((t) => ({
    id: `section-${t.id}`,
    title: t.title,
    content: t.content || "",
  }));

  return <LegalPage type="privacy" data={{ sections }} />;
}
