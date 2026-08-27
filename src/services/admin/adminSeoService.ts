import { adminDataClient } from '@/lib/adminCoreApi';

export interface SeoConfigTranslations {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  slug?: string;
}

export interface SeoConfigPayload {
  page_key?: string;
  translations?: Record<string, SeoConfigTranslations>;
  og_image?: string | null; // base64 string or null to clear
}

export interface SeoConfigResponse {
  page_key: string;
  translations: Record<string, SeoConfigTranslations>;
  og_image: string | null;
  updated_at: string;
}

export async function getSeoConfig(pageKey: string): Promise<SeoConfigResponse> {
  return await adminDataClient.get(`/seo-config/${pageKey}/`);
}

export async function updateSeoConfig(pageKey: string, payload: SeoConfigPayload): Promise<SeoConfigResponse> {
  return await adminDataClient.patch(`/seo-config/${pageKey}/`, payload);
}

export { fileToBase64 } from "@/utils/imageUtils";
