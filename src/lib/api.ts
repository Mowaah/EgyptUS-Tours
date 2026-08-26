import axios from 'axios';

// The base URL defaults to the NEXT_PUBLIC_API_URL environment variable
// Example: http://127.0.0.1:8000
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const getFullImageUrl = (path: string | undefined | null) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
};

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
      } else {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
      }

      // If refresh failed or wasn't present, retry without Authorization header if it's a GET request
      if (originalRequest.method?.toLowerCase() === 'get' && originalRequest.headers?.Authorization) {
        delete originalRequest.headers.Authorization;
        try {
          return await apiClient(originalRequest);
        } catch (e) {
          // Ignore fallback error and reject original
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

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If we get a 401 and an Authorization header was sent, retry without it so public endpoints still load!
  if (response.status === 401 && (headers as Record<string, string>)['Authorization']) {
    const fallbackHeaders = { ...headers as Record<string, string> };
    delete fallbackHeaders['Authorization'];
    response = await fetch(url, {
      ...options,
      headers: fallbackHeaders,
    });
  }

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
  // Parse budget string e.g. "$1,000 - $3,000" or "$3,000+"
  let budget_min = null;
  let budget_max = null;
  const currency = "usd";
  
  if (tripData.preferences.budget) {
    const budgetStr = tripData.preferences.budget.replace(/[^0-9\-+]/g, '');
    const parts = budgetStr.split('-');
    if (parts.length === 2) {
      budget_min = parseInt(parts[0], 10);
      budget_max = parseInt(parts[1], 10);
    } else if (budgetStr.includes('+')) {
      budget_min = parseInt(budgetStr.replace('+', ''), 10);
    } else {
      budget_min = parseInt(budgetStr, 10);
      budget_max = parseInt(budgetStr, 10);
    }
  }

  const payload = {
    destination_ids: tripData.destinations,
    full_name: tripData.travelerInfo.name,
    email: tripData.travelerInfo.email,
    phone: tripData.travelerInfo.phone,
    nationality: tripData.travelerInfo.nationality,
    start_date: formatDateForBackend(tripData.travelerInfo.startDate),
    end_date: formatDateForBackend(tripData.travelerInfo.endDate),
    adults: tripData.travelerInfo.adults,
    children: tripData.travelerInfo.children,
    infants: tripData.travelerInfo.infants,
    trip_details_text: tripData.travelerInfo.tripDetails,
    
    trip_categories: tripData.preferences.tripCategory,
    duration: tripData.preferences.duration,
    budget_min,
    budget_max,
    currency,
    hotel_category: tripData.preferences.hotelCategory,
    room_types: tripData.preferences.roomType,
    transportation_type: tripData.preferences.transportation,
    experiences: tripData.preferences.experiences,
    activities: tripData.preferences.activities,
    preferred_contact_method: tripData.preferences.contactMethod === "Phone Call" 
      ? "phone" 
      : tripData.preferences.contactMethod?.toLowerCase(),
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

export async function googleLoginCustomer(idToken: string): Promise<any> {
  return await apiClient.post('/auth/google/', { id_token: idToken });
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
export async function getProfileSummary(): Promise<{ bookings_count: number; requests_count: number }> {
  return await apiClient.get('/profile/summary/');
}

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

export interface PublicBookingPaymentResponse {
  id: number;
  message: string;
  payment_url: string;
  payment_link_status: string;
  payment_plan: string;
  payment_method: string;
  total_price: string;
  deposit_amount: string;
  currency: string;
}

export async function submitHotelBooking(data: Record<string, unknown>): Promise<PublicBookingPaymentResponse> {
  return await apiClient.post('/hotel-bookings/', data);
}

export async function submitTripBooking(data: any): Promise<any> {
  return await apiClient.post('/booking-requests/trips/', data);
}

export async function submitTransportationBooking(data: any): Promise<any> {
  return await apiClient.post('/booking-requests/transportation/', data);
}

export function formatUrlForBackend(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  
  // Fix common typos like http:/ or https:/ (with only 1 slash or 3+ slashes) and normalize to exactly two slashes
  if (/^https?:\/+([^\/].*)$/i.test(trimmed)) {
    return trimmed.replace(/^https?:\/+/i, (match) => {
      return match.toLowerCase().startsWith("http:") ? "http://" : "https://";
    });
  }
  
  // If it doesn't start with any valid scheme (like http://, https://, ftp://), prepend https://
  if (!/^[a-z]+:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function extractApiError(err: any, defaultMessage = "Something went wrong while submitting your request. Please try again."): string {
  if (err?.response?.data) {
    const data = err.response.data;
    if (typeof data === "string") {
      return data;
    }
    if (typeof data === "object" && !Array.isArray(data)) {
      const messages: string[] = [];
      for (const [key, val] of Object.entries(data)) {
        const fieldName = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        if (Array.isArray(val)) {
          messages.push(`${fieldName}: ${val.join(" ")}`);
        } else if (typeof val === "string") {
          messages.push(`${fieldName}: ${val}`);
        } else if (typeof val === "object" && val !== null) {
          for (const [subKey, subVal] of Object.entries(val as any)) {
            const subFieldName = subKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
            if (Array.isArray(subVal)) {
              messages.push(`${fieldName} -> ${subFieldName}: ${subVal.join(" ")}`);
            } else if (typeof subVal === "string") {
              messages.push(`${fieldName} -> ${subFieldName}: ${subVal}`);
            }
          }
        }
      }
      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
  }
  return err?.message || defaultMessage;
}

export function extractFieldErrors(err: any): Record<string, string> {
  const result: Record<string, string> = {};
  if (err?.response?.data && typeof err.response.data === "object" && !Array.isArray(err.response.data)) {
    for (const [key, val] of Object.entries(err.response.data)) {
      if (Array.isArray(val) && val.length > 0) {
        result[key] = val.join(" ");
      } else if (typeof val === "string") {
        result[key] = val;
      }
    }
  }
  return result;
}

export async function submitEventProposal(data: any): Promise<any> {
  const payload = {
    organization: {
      name: data.organization?.name || "",
      industry: data.organization?.industry || "",
      country: data.organization?.country || "",
      website: formatUrlForBackend(data.organization?.website),
      contact_person: data.organization?.contactPerson || "",
      job_title: data.organization?.jobTitle || "",
      email: data.organization?.email || "",
      phone: data.organization?.phone || "",
    },
    event_details: {
      event_type: data.eventDetails?.eventType || "",
      event_name: data.eventDetails?.eventName || "",
      expected_attendees: parseInt(data.eventDetails?.expectedAttendees, 10) || 0,
      preferred_city: data.eventDetails?.preferredCity || "",
      start_date: formatDateForBackend(data.eventDetails?.startDate),
      end_date: formatDateForBackend(data.eventDetails?.endDate),
      description: data.eventDetails?.description || "",
    },
    requirements: {
      venue_type: data.requirements?.venueType || "",
      additional_services: data.requirements?.additionalServices || [],
      additional_requirements: data.requirements?.additionalRequirements || "",
    },
    budget: {
      estimated_budget_range: data.budget?.estimatedBudget || "",
      budget_flexibility: data.budget?.budgetFlexibility || "",
      hear_about_us: data.budget?.hearAboutUs || "",
    },
  };
  return await apiClient.post('/proposals/events/', payload);
}

export async function submitB2BProposal(data: any): Promise<any> {
  const payload = {
    company_name: data.companyName || "",
    country: data.country || "",
    contact_person: data.contactPerson || "",
    job_title: data.jobTitle || "",
    email: data.email || "",
    phone: data.phone || "",
    website: formatUrlForBackend(data.website),
    request_details: data.requestDetails || "",
  };
  return await apiClient.post('/proposals/b2b/', payload);
}

export async function submitContactInquiry(data: { full_name: string; email: string; message: string }): Promise<any> {
  return await apiClient.post('/contact/', data);
}

// ----------------------------------------------------------------------
// AI Assistant API & Types
// ----------------------------------------------------------------------
export interface AssistantQuickReply {
  label: string;
  message: string;
}

export interface AssistantCard {
  type: 'trip' | 'hotel' | 'vehicle';
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  image?: string | null;
  price: string;
  currency_code: string;
  rating: string;
  review_count: number;
  duration_days?: number | null;
  duration_nights?: number | null;
  cta_label: string;
  href: string;
}

export interface AssistantEscalation {
  should_escalate: boolean;
  label: string;
  message: string;
  href: string;
}

export interface AssistantConfig {
  name: string;
  subtitle: string;
  status: 'online' | 'offline' | string;
  greeting: string;
  quick_replies: AssistantQuickReply[];
  chat_endpoint: string;
}

export interface AssistantChatResponse {
  message: string;
  kind: string;
  cards: AssistantCard[];
  quick_replies: AssistantQuickReply[];
  escalation: AssistantEscalation;
  source: string;
}

export async function getAssistantConfig(): Promise<AssistantConfig> {
  return await apiClient.get('/assistant/config/');
}

export async function sendAssistantMessage(message: string, currentPath: string = ''): Promise<AssistantChatResponse> {
  return await apiClient.post('/assistant/chat/', {
    message,
    current_path: currentPath,
  });
}

// ----------------------------------------------------------------------
// Payment Receipt
// ----------------------------------------------------------------------
export const getPaymentReceipt = async (paymentNumber: string) => {
  const res = await apiClient.get(`/payments/receipt/${paymentNumber}/`);
  return res as any;
};
