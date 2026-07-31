import { adminDataClient } from '@/lib/adminCoreApi';
import type { PaginatedResponse } from '@/types/api/index';

export interface LegalTranslation {
  en?: { title?: string; content?: string; question?: string; answer?: string };
  it?: { title?: string; content?: string; question?: string; answer?: string };
  es?: { title?: string; content?: string; question?: string; answer?: string };
  fr?: { title?: string; content?: string; question?: string; answer?: string };
  de?: { title?: string; content?: string; question?: string; answer?: string };
}

export interface AdminSiteFaq {
  id: number;
  translations: LegalTranslation;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AdminLegalSection {
  id: number;
  translations: LegalTranslation;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------
// FAQS
// ----------------------------------------------------------------------
export async function getAdminFaqs(params?: Record<string, any>): Promise<PaginatedResponse<AdminSiteFaq>> {
  return await adminDataClient.get('/faqs/', { params });
}

export async function createAdminFaq(data: Partial<AdminSiteFaq>): Promise<AdminSiteFaq> {
  return await adminDataClient.post('/faqs/', data);
}

export async function updateAdminFaq(id: number | string, data: Partial<AdminSiteFaq>): Promise<AdminSiteFaq> {
  return await adminDataClient.patch(`/faqs/${id}/`, data);
}

export async function deleteAdminFaq(id: number | string): Promise<void> {
  return await adminDataClient.delete(`/faqs/${id}/`);
}

// ----------------------------------------------------------------------
// PRIVACY POLICY
// ----------------------------------------------------------------------
export async function getAdminPrivacySections(params?: Record<string, any>): Promise<PaginatedResponse<AdminLegalSection>> {
  return await adminDataClient.get('/privacy/', { params });
}

export async function createAdminPrivacySection(data: Partial<AdminLegalSection>): Promise<AdminLegalSection> {
  return await adminDataClient.post('/privacy/', data);
}

export async function updateAdminPrivacySection(id: number | string, data: Partial<AdminLegalSection>): Promise<AdminLegalSection> {
  return await adminDataClient.patch(`/privacy/${id}/`, data);
}

export async function deleteAdminPrivacySection(id: number | string): Promise<void> {
  return await adminDataClient.delete(`/privacy/${id}/`);
}

// ----------------------------------------------------------------------
// TERMS & CONDITIONS
// ----------------------------------------------------------------------
export async function getAdminTermsSections(params?: Record<string, any>): Promise<PaginatedResponse<AdminLegalSection>> {
  return await adminDataClient.get('/terms/', { params });
}

export async function createAdminTermsSection(data: Partial<AdminLegalSection>): Promise<AdminLegalSection> {
  return await adminDataClient.post('/terms/', data);
}

export async function updateAdminTermsSection(id: number | string, data: Partial<AdminLegalSection>): Promise<AdminLegalSection> {
  return await adminDataClient.patch(`/terms/${id}/`, data);
}

export async function deleteAdminTermsSection(id: number | string): Promise<void> {
  return await adminDataClient.delete(`/terms/${id}/`);
}
