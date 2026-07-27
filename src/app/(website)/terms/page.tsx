import LegalPage from "@/components/website/LegalPage/LegalPage";
import { LegalSection } from "@/components/website/LegalPage/legalData";
import { getTerms } from "@/services/legalHelpService";

export const metadata = {
  title: "Terms and Conditions | Egypt Us Tours",
  description: "Read our terms and conditions to understand your rights and responsibilities.",
};

export const revalidate = 60;

export default async function Page() {
  const termsData = await getTerms();

  const sections: LegalSection[] = termsData.map(t => ({
    id: `section-${t.id}`,
    title: t.title,
    content: t.content || ""
  }));

  const finalData = {
    title: "Terms and conditions",
    subtitle: "Please read carefully to understand your rights, responsibilities, and the rules of using our services.",
    sections
  };

  return <LegalPage data={finalData} />;
}
