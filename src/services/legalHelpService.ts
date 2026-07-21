const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BackendFaq {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface BackendLegalSection {
  id: number;
  title: string;
  content: string;
  order: number;
}

async function fetchFromApi(endpoint: string) {
  const url = new URL(`${API_BASE_URL}/api/v1/${endpoint}`);
  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: {
      'Accept': 'application/json',
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results || []);
}

export async function getFaqs(lang: string = "en"): Promise<BackendFaq[]> {
  try {
    return await fetchFromApi(`faqs/?lang=${lang}`);
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    return [];
  }
}

export async function getTerms(lang: string = "en"): Promise<BackendLegalSection[]> {
  try {
    return await fetchFromApi(`terms/?lang=${lang}`);
  } catch (error) {
    console.error("Failed to fetch Terms:", error);
    return [];
  }
}

export async function getPrivacy(lang: string = "en"): Promise<BackendLegalSection[]> {
  try {
    return await fetchFromApi(`privacy/?lang=${lang}`);
  } catch (error) {
    console.error("Failed to fetch Privacy:", error);
    return [];
  }
}
