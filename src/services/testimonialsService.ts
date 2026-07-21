import { PaginatedResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BackendTestimonial {
  id: number;
  testimonial_number: string;
  customer_name: string;
  country: string;
  category: string;
  rating: number;
  title: string;
  description: string;
  video_url: string | null;
  is_featured: boolean;
  status: string;
  created_at: string;
}

export async function getTestimonials(params?: Record<string, string>): Promise<BackendTestimonial[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/testimonials/`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value);
        }
      });
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch testimonials: ${res.statusText}`);
    }

    const data: PaginatedResponse<BackendTestimonial> = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error in getTestimonials:", error);
    return [];
  }
}
