import { PaginatedResponse } from "@/types/api";
import { serverFetch } from "@/lib/api";

export interface TestimonialData {
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

export async function getTestimonials(params?: Record<string, string>): Promise<TestimonialData[]> {
  try {
    const query = new URLSearchParams({ page_size: "100", ...(params || {}) });
    const allResults: TestimonialData[] = [];
    let endpoint = `/testimonials/?${query.toString()}`;

    while (endpoint) {
      const data = await serverFetch<PaginatedResponse<TestimonialData>>(endpoint, {
        next: { revalidate: 60 },
      });
      if (Array.isArray(data?.results)) {
        allResults.push(...data.results);
      }

      if (data?.next && data?.results?.length && allResults.length < (data?.count ?? allResults.length + 1)) {
        const url = new URL(data.next);
        endpoint = url.pathname + url.search;
        endpoint = endpoint.replace('/api/v1', '');
      } else {
        break;
      }
    }

    return allResults;
  } catch (error) {
    console.error("Error in getTestimonials:", error);
    return [];
  }
}

