import { getTerms, getPrivacy, type LegalSectionData } from "@/services/legalHelpService";

export interface LegalTab {
  key: string;
  label: string;
  content: string;
}

export async function fetchLegalTabs(language?: string): Promise<LegalTab[]> {
  const [termsData, privacyData] = await Promise.all([getTerms(language), getPrivacy(language)]);

  const termsTabs: LegalTab[] = termsData.map((s: LegalSectionData) => ({
    key: `terms-${s.id}`,
    label: s.title,
    content: s.content,
  }));

  const privacyTabs: LegalTab[] = privacyData.map((s: LegalSectionData) => ({
    key: `privacy-${s.id}`,
    label: s.title,
    content: s.content,
  }));

  return [...termsTabs, ...privacyTabs];
}
