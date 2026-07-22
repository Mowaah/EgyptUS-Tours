import axios from 'axios';

// The base URL defaults to the NEXT_PUBLIC_API_URL environment variable
// Example: http://127.0.0.1:8000
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// ----------------------------------------------------------------------
// 1. Client-side Axios Instance
// ----------------------------------------------------------------------
export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  // You can set withCredentials: true if dealing with cookies for auth
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const Cookies = require('js-cookie');
      const token = Cookies.get('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Immediately return the data layer
  },
  async (error) => {
    const originalRequest = error.config;
    // Handle global errors, token refreshes, etc.
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true;
      const Cookies = require('js-cookie');
      const refresh = Cookies.get('refresh_token');
      
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh/`, { refresh });
          if (res.data.access) {
            Cookies.set('access_token', res.data.access, { expires: 1 });
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------
// 2. Server-side Fetch Utility (For Next.js App Router caching)
// ----------------------------------------------------------------------
export async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure the endpoint starts with a slash
  const url = `${BASE_URL}/api/v1${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token.value}`;
      // Never cache requests that include user-specific tokens
      options.cache = 'no-store';
      delete options.next; // Remove any ISR revalidate options
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// ----------------------------------------------------------------------
// 3. Application API calls
// ----------------------------------------------------------------------

export async function getDestinations(): Promise<any> {
  const response = await apiClient.get('/destinations/');
  return response; // Interceptor already unwraps data
}

function formatDateForBackend(dateStr: string) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return dateStr;
}

export async function createCustomTripRequest(tripData: any): Promise<any> {
  // We format the tripData into the structure expected by the backend
  const payload = {
    destination_ids: tripData.destinations,
    traveler_info: {
      name: tripData.travelerInfo.name,
      email: tripData.travelerInfo.email,
      phone: tripData.travelerInfo.phone,
      nationality: tripData.travelerInfo.nationality,
      start_date: formatDateForBackend(tripData.travelerInfo.startDate),
      end_date: formatDateForBackend(tripData.travelerInfo.endDate),
      adults: tripData.travelerInfo.adults,
      children: tripData.travelerInfo.children,
      infants: tripData.travelerInfo.infants,
      trip_details: tripData.travelerInfo.tripDetails,
    },
    preferences: {
      trip_category: tripData.preferences.tripCategory,
      duration: tripData.preferences.duration,
      budget: tripData.preferences.budget,
      hotel_category: tripData.preferences.hotelCategory,
      room_type: tripData.preferences.roomType,
      transportation: tripData.preferences.transportation,
      experiences: tripData.preferences.experiences,
      activities: tripData.preferences.activities,
      contact_method: tripData.preferences.contactMethod,
    }
  };

  const response = await apiClient.post('/custom-trip-requests/', payload);
  return response; // Interceptor already unwraps data
}

export async function loginCustomer(payload: any): Promise<any> {
  return await apiClient.post('/auth/login/', payload);
}

export async function signupCustomer(payload: any): Promise<any> {
  return await apiClient.post('/auth/signup/', payload);
}

export async function verifyCustomerEmail(payload: { token: string }): Promise<any> {
  return await apiClient.post('/auth/email/verify/', payload);
}

export async function resendCustomerEmailVerification(payload: { email: string }): Promise<any> {
  return await apiClient.post('/auth/email/resend/', payload);
}

export async function logoutCustomer(payload: { refresh: string }, accessToken?: string): Promise<any> {
  const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
  return await apiClient.post('/auth/logout/', payload, config);
}

// --- Favorites ---
export async function getFavoriteTripIds(): Promise<Set<string>> {
  const res: any = await apiClient.get('/profile/favorites/trips/?page_size=1000');
  const results: Array<{ slug: string }> = res?.results ?? [];
  return new Set(results.map((t) => t.slug));
}

export async function getFavoriteTrips(): Promise<any[]> {
  const res: any = await apiClient.get('/profile/favorites/trips/?page_size=100');
  return res?.results ?? [];
}

export async function addTripFavorite(slug: string): Promise<any> {
  return await apiClient.post(`/profile/favorites/trips/${slug}/`);
}

export async function removeTripFavorite(slug: string): Promise<any> {
  return await apiClient.delete(`/profile/favorites/trips/${slug}/`);
}

export async function getFavoriteHotelIds(): Promise<Set<string>> {
  const res: any = await apiClient.get('/profile/favorites/hotels/?page_size=1000');
  const results: Array<{ slug: string }> = res?.results ?? [];
  return new Set(results.map((h) => h.slug));
}

export async function getFavoriteHotels(): Promise<any[]> {
  const res: any = await apiClient.get('/profile/favorites/hotels/?page_size=100');
  return res?.results ?? [];
}

export async function addHotelFavorite(slug: string): Promise<any> {
  return await apiClient.post(`/profile/favorites/hotels/${slug}/`);
}

export async function removeHotelFavorite(slug: string): Promise<any> {
  return await apiClient.delete(`/profile/favorites/hotels/${slug}/`);
}

// --- Requests & Bookings ---
export async function getProfileRequests(type: string): Promise<any[]> {
  const res: any = await apiClient.get(`/profile/requests/?type=${type}&page_size=100`);
  return res?.results ?? [];
}

export async function getProfileRequestDetail(type: string, id: string): Promise<any> {
  return await apiClient.get(`/profile/requests/${id}/?type=${type}`);
}

export async function getProfileBookings(type: string): Promise<any[]> {
  const res: any = await apiClient.get(`/profile/bookings/?type=${type}&page_size=100`);
  return res?.results ?? [];
}

export async function getProfileBookingDetail(type: string, id: string): Promise<any> {
  return await apiClient.get(`/profile/bookings/${id}/?type=${type}`);
}
