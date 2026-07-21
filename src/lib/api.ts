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
    // We can inject JWT tokens here later
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
  (error) => {
    // Handle global errors, token refreshes, etc.
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

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
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
