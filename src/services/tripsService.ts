import { PaginatedResponse, TripList, TripDetail } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getAllTrips(params?: Record<string, string>): Promise<TripList[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/trips/`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value && key !== "page_size") {
          url.searchParams.append(key, value);
        }
      });
    }

    const allResults: TripList[] = [];
    let nextUrl: string | null = url.toString();

    while (nextUrl) {
      const res = await fetch(nextUrl, {
        next: { revalidate: 60 },
        headers: { "Accept": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed to fetch trips: ${res.statusText}`);

      const data: PaginatedResponse<TripList> = await res.json();
      allResults.push(...data.results);
      nextUrl = data.next ?? null;
    }

    return allResults;
  } catch (error) {
    console.error("Error in getAllTrips:", error);
    return [];
  }
}

export async function getTripById(idOrSlug: string): Promise<TripDetail | null> {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/trips/${idOrSlug}/`);
    
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch trip details: ${res.statusText}`);
    }

    const data: TripDetail = await res.json();
    return data;
  } catch (error) {
    console.error(`Error in getTripById(${idOrSlug}):`, error);
    return null;
  }
}
