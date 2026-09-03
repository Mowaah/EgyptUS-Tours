import { serverFetch, apiClient } from "@/lib/api";

export interface FaqData {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface LegalSectionData {
  id: number;
  title: string;
  content: string;
  order: number;
}

export async function getFaqs(lang?: string): Promise<FaqData[]> {
  try {
    const endpoint = lang ? `/faqs/?lang=${lang}` : `/faqs/`;
    if (typeof window !== "undefined") {
      // apiClient interceptor already unwraps response.data
      const data = await (apiClient.get(endpoint) as unknown as Promise<any>);
      return Array.isArray(data) ? data : (data?.results || []);
    }
    const data = await serverFetch<any>(endpoint, { next: { revalidate: 60 } });
    return Array.isArray(data) ? data : (data?.results || []);
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    return [];
  }
}

export async function getTerms(lang?: string): Promise<LegalSectionData[]> {
  try {
    const endpoint = lang ? `/terms/?lang=${lang}` : `/terms/`;
    if (typeof window !== "undefined") {
      const data = await (apiClient.get(endpoint) as unknown as Promise<any>);
      return Array.isArray(data) ? data : (data?.results || []);
    }
    const data = await serverFetch<any>(endpoint, { next: { revalidate: 60 } });
    return Array.isArray(data) ? data : (data?.results || []);
  } catch (error) {
    console.error("Failed to fetch Terms:", error);
    return [];
  }
}

export async function getPrivacy(lang?: string): Promise<LegalSectionData[]> {
  try {
    const endpoint = lang ? `/privacy/?lang=${lang}` : `/privacy/`;
    if (typeof window !== "undefined") {
      const data = await (apiClient.get(endpoint) as unknown as Promise<any>);
      return Array.isArray(data) ? data : (data?.results || []);
    }
    const data = await serverFetch<any>(endpoint, { next: { revalidate: 60 } });
    return Array.isArray(data) ? data : (data?.results || []);
  } catch (error) {
    console.error("Failed to fetch Privacy:", error);
    return [];
  }
}
