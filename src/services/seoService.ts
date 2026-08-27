import { BASE_URL } from "@/lib/api";

export interface SeoConfigTranslations {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  slug?: string;
}

export interface SeoConfigResponse {
  page_key: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  slug?: string;
  og_image: string | null;
  image_title?: string;
  image_alt?: string;
  updated_at?: string;
}

/**
 * Fetches SEO config for a page key from the public API (no auth required).
 * Safe to use in Server Components and generateMetadata.
 */
export async function getPublicSeoConfig(pageKey: string): Promise<SeoConfigResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/seo-config/${pageKey}/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}


