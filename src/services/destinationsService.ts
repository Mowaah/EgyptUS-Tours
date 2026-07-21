import { PaginatedResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface DestinationList {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  region: string;
  region_display: string;
  image: string | null;
  thumbnail: string | null;
  is_featured: boolean;
  children_count: number;
}

export async function getAllDestinations(): Promise<DestinationList[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/destinations/`);
    
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch destinations: ${res.statusText}`);
    }

    const data: PaginatedResponse<DestinationList> = await res.json();
    return data.results;
  } catch (error) {
    console.error("Error in getAllDestinations:", error);
    return [];
  }
}
