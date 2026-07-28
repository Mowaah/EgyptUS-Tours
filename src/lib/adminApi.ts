import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// ----------------------------------------------------------------------
// 1. Admin Axios Instance
// ----------------------------------------------------------------------
export const adminApiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1/admin/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
adminApiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('admin_access_token');
      const publicEndpoints = ['/login/', '/totp/', '/password/forgot/', '/password/reset/'];
      const isPublic = publicEndpoints.some(ep => config.url?.includes(ep));
      if (token && !isPublic) {
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
adminApiClient.interceptors.response.use(
  (response) => {
    return response.data; // Unwrap data layer
  },
  async (error) => {
    const originalRequest = error.config;
    // Handle 401s for token refresh
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true;
      const refresh = Cookies.get('admin_refresh_token');
      
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/api/v1/admin/auth/refresh/`, { refresh });
          if (res.data.access) {
            Cookies.set('admin_access_token', res.data.access, { expires: 1 });
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return adminApiClient(originalRequest);
          }
        } catch (refreshError) {
          Cookies.remove('admin_access_token');
          Cookies.remove('admin_refresh_token');
        }
      } else {
        Cookies.remove('admin_access_token');
        Cookies.remove('admin_refresh_token');
      }

      // If refresh fails on a GET request, retry without Auth header (though admin is strictly protected)
      if (originalRequest.method?.toLowerCase() === 'get' && originalRequest.headers?.Authorization) {
        delete originalRequest.headers.Authorization;
        try {
          return await adminApiClient(originalRequest);
        } catch (e) {
          // Ignore fallback error
        }
      }
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------
// 2. Admin API wrappers
// ----------------------------------------------------------------------

export async function loginAdmin(payload: any): Promise<any> {
  return await adminApiClient.post('/login/', payload);
}

export async function verifyAdminTotp(payload: { challenge_token: string; code: string }): Promise<any> {
  return await adminApiClient.post('/totp/verify/', payload);
}

export async function enrollAdminTotp(payload: { setup_token: string }): Promise<any> {
  return await adminApiClient.post('/totp/enroll/', payload);
}

export async function confirmAdminTotp(payload: { setup_token: string; code: string }): Promise<any> {
  return await adminApiClient.post('/totp/confirm/', payload);
}

export async function forgotAdminPassword(payload: { email: string }): Promise<any> {
  return await adminApiClient.post('/password/forgot/', payload);
}

export async function resetAdminPassword(payload: any): Promise<any> {
  return await adminApiClient.post('/password/reset/', payload);
}

export async function changeAdminPassword(payload: any): Promise<any> {
  return await adminApiClient.post('/password/change/', payload);
}

export async function getAdminProfile(): Promise<any> {
  return await adminApiClient.get('/me/');
}

export async function updateAdminProfile(payload: any): Promise<any> {
  return await adminApiClient.patch('/me/', payload);
}

export async function logoutAdmin(payload: { refresh: string }, accessToken?: string): Promise<any> {
  const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
  return await adminApiClient.post('/logout/', payload, config);
}
