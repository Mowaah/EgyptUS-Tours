import { adminDataClient } from '@/lib/adminCoreApi';
import type { PaginatedResponse } from '@/types/api/index';

// ----------------------------------------------------------------------
// USER REVIEWS (CatalogReviews)
// ----------------------------------------------------------------------

export interface AdminUserReview {
  id: number;
  review_number: string;
  target_type: 'trip' | 'hotel' | 'vehicle';
  trip: { id: number; title: string } | null;
  hotel: { id: number; name: string } | null;
  vehicle: { id: number; name: string } | null;
  customer: { id: number; user: { name: string; email: string } } | null;
  author_name: string;
  author_email: string;
  title: string;
  body: string;
  review_date: string;
  rating: string | number;
  moderation_status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  admin_reply: string;
  admin_replied_at: string | null;
  created_at: string;
}

export async function getAdminUserReviews(params?: Record<string, any>): Promise<PaginatedResponse<AdminUserReview>> {
  return await adminDataClient.get('/reviews/user-reviews/', { params });
}

export async function updateAdminUserReview(id: number | string, data: Partial<AdminUserReview>): Promise<AdminUserReview> {
  return await adminDataClient.patch(`/reviews/user-reviews/${id}/`, data);
}

export async function replyToAdminUserReview(id: number | string, admin_reply: string): Promise<AdminUserReview> {
  return await adminDataClient.patch(`/reviews/user-reviews/${id}/reply/`, { admin_reply });
}

export async function deleteAdminUserReview(id: number | string): Promise<void> {
  return await adminDataClient.delete(`/reviews/user-reviews/${id}/`);
}

export async function getAdminUserReviewsStats(params?: { range?: string }): Promise<any> {
  return await adminDataClient.get('/reviews/user-reviews/stats/', { params });
}

// ----------------------------------------------------------------------
// ADMIN TESTIMONIALS
// ----------------------------------------------------------------------

export interface AdminTestimonial {
  id: number;
  testimonial_number: string;
  customer_name: string;
  country: string;
  category: 'trip' | 'hotel' | 'transport' | 'b2b' | 'mice';
  rating: number;
  title: string;
  description: string;
  video_url: string;
  is_featured: boolean;
  status: 'draft' | 'published';
  created_at: string;
  added_by_email?: string;
  added_by_name?: string;
  added_by?: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  };
}

export async function getAdminTestimonials(params?: Record<string, any>): Promise<PaginatedResponse<AdminTestimonial>> {
  return await adminDataClient.get('/reviews/testimonials/', { params });
}

export async function createAdminTestimonial(data: Partial<AdminTestimonial>): Promise<AdminTestimonial> {
  return await adminDataClient.post('/reviews/testimonials/', data);
}

export async function updateAdminTestimonial(id: number | string, data: Partial<AdminTestimonial>): Promise<AdminTestimonial> {
  return await adminDataClient.patch(`/reviews/testimonials/${id}/`, data);
}

export async function deleteAdminTestimonial(id: number | string): Promise<void> {
  return await adminDataClient.delete(`/reviews/testimonials/${id}/`);
}

export async function getAdminTestimonialsStats(params?: { range?: string }): Promise<any> {
  return await adminDataClient.get('/reviews/testimonials/stats/', { params });
}
