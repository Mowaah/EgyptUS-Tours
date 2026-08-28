import { adminDataClient } from '@/lib/adminCoreApi';
import type { PaginatedResponse } from '@/types/api/index';

export interface Translation {
  en?: { title?: string; short_description?: string; description?: string; content?: string };
  it?: { title?: string; short_description?: string; description?: string; content?: string };
  es?: { title?: string; short_description?: string; description?: string; content?: string };
  fr?: { title?: string; short_description?: string; description?: string; content?: string };
  de?: { title?: string; short_description?: string; description?: string; content?: string };
}

// ----------------------------------------------------------------------
// PROMOTIONS
// ----------------------------------------------------------------------
export interface AdminPromotionList {
  id: number;
  offer_number: string;
  title: string;
  status: 'draft' | 'active' | 'inactive';
  discount_value: string | number;
  applies_to: 'trip' | 'hotel' | 'transport';
  valid_from: string | null;
  valid_to: string | null;
  usage_count: number;
  created_at: string;
}

export interface AdminPromotion extends AdminPromotionList {
  description: string;
  target_countries: string[];
  applies_to_rules: any[];
  translations: Translation;
  trips: number[];
  hotels: number[];
  vehicles: number[];
}

export async function getAdminPromotions(params?: any): Promise<PaginatedResponse<AdminPromotionList>> {
  return await adminDataClient.get('/marketing/promotions/', { params });
}

export async function getAdminPromotionById(id: string | number): Promise<AdminPromotion> {
  return await adminDataClient.get(`/marketing/promotions/${id}/`);
}

export async function createAdminPromotion(data: any): Promise<AdminPromotion> {
  return await adminDataClient.post('/marketing/promotions/', data);
}

export async function updateAdminPromotion(id: string | number, data: any): Promise<AdminPromotion> {
  return await adminDataClient.patch(`/marketing/promotions/${id}/`, data);
}

export async function deleteAdminPromotion(id: string | number): Promise<any> {
  return await adminDataClient.delete(`/marketing/promotions/${id}/`);
}

// ----------------------------------------------------------------------
// BLOGS
// ----------------------------------------------------------------------
export async function getAdminBlogs(params?: any): Promise<any> {
  return await adminDataClient.get('/marketing/blogs/', { params });
}

export async function getAdminBlogById(id: number | string): Promise<any> {
  return await adminDataClient.get(`/marketing/blogs/${id}/`);
}

export async function getAdminMarketingCategories(): Promise<any> {
  return await adminDataClient.get('/marketing/categories/');
}

export async function createAdminMarketingCategory(payload: any): Promise<any> {
  return await adminDataClient.post('/marketing/categories/', payload);
}

export async function createAdminBlog(payload: any): Promise<any> {
  return await adminDataClient.post('/marketing/blogs/', payload);
}

export async function updateAdminBlog(id: number | string, payload: any): Promise<any> {
  return await adminDataClient.patch(`/marketing/blogs/${id}/`, payload);
}

export async function deleteAdminBlog(id: number | string): Promise<any> {
  return await adminDataClient.delete(`/marketing/blogs/${id}/`);
}

export async function exportAdminBlogsCSV(params?: any): Promise<Blob> {
  return await adminDataClient.get('/marketing/blogs/export/', { 
    params, 
    responseType: 'blob' 
  });
}

// ----------------------------------------------------------------------
// ARTICLES
// ----------------------------------------------------------------------
export async function getAdminArticles(params?: any): Promise<any> {
  return await adminDataClient.get('/marketing/articles/', { params });
}

export async function getAdminArticleById(id: number | string): Promise<any> {
  return await adminDataClient.get(`/marketing/articles/${id}/`);
}

export async function createAdminArticle(payload: any): Promise<any> {
  return await adminDataClient.post('/marketing/articles/', payload);
}

export async function updateAdminArticle(id: number | string, payload: any): Promise<any> {
  return await adminDataClient.patch(`/marketing/articles/${id}/`, payload);
}

export async function deleteAdminArticle(id: number | string): Promise<any> {
  return await adminDataClient.delete(`/marketing/articles/${id}/`);
}

export async function exportAdminArticlesCSV(params?: any): Promise<Blob> {
  return await adminDataClient.get('/marketing/articles/export/', { 
    params, 
    responseType: 'blob' 
  });
}
