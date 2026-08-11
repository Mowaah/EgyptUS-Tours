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

/**
 * Converts a File object to a base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
