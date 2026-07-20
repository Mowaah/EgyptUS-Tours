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
