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
    if (typeof window !== "undefined") {
      let page = 1;
      const allResults: FaqData[] = [];
      while (true) {
        const data: any = await apiClient.get('/faqs/', {
          params: { page_size: 100, ...(lang ? { lang } : {}), page },
        });
        const items = Array.isArray(data) ? data : (data?.results || []);
        allResults.push(...items);
        const count = Number(data?.count ?? allResults.length);
        if (!data?.next || items.length === 0 || allResults.length >= count) {
          break;
        }
        page++;
      }
      return allResults;
    }

    const params = new URLSearchParams({ page_size: "100" });
    if (lang) params.append("lang", lang);
    let endpoint = `/faqs/?${params.toString()}`;
    const allResults: FaqData[] = [];

    while (endpoint) {
      const data = await serverFetch<any>(endpoint, { next: { revalidate: 60 } });
      const items = Array.isArray(data) ? data : (data?.results || []);
      allResults.push(...items);

      if (data?.next && items.length && allResults.length < (data?.count ?? allResults.length + 1)) {
        const url = new URL(data.next);
        endpoint = url.pathname + url.search;
        endpoint = endpoint.replace('/api/v1', '');
      } else {
        break;
      }
    }
    return allResults;
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
