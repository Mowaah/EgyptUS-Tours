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

export const adminDataClient = axios.create({
  baseURL: `${BASE_URL}/api/v1/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminDataClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('admin_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminDataClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true;
      const refresh = Cookies.get('admin_refresh_token');
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/api/v1/admin/auth/refresh/`, { refresh });
          if (res.data.access) {
            Cookies.set('admin_access_token', res.data.access, { expires: 1 });
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return adminDataClient(originalRequest);
          }
        } catch (refreshError) {
          Cookies.remove('admin_access_token');
          Cookies.remove('admin_refresh_token');
          window.location.href = '/dashboard/login';
        }
      } else {
        Cookies.remove('admin_access_token');
        Cookies.remove('admin_refresh_token');
        window.location.href = '/dashboard/login';
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

export async function getAdminUsers(params?: any): Promise<any> {
  return await adminDataClient.get('/users/', { params });
}

// ----------------------------------------------------------------------
// 3. Admin Data API wrappers (Requests, Leads, etc.)
// ----------------------------------------------------------------------

export async function getPlanYourTripRequests(params?: any): Promise<any> {
  return await adminDataClient.get('/requests/plan-your-trip/', { params });
}

export async function getAllPlanYourTripRequests(params: any = {}): Promise<any[]> {
  const firstPage = await getPlanYourTripRequests(params);
  const results = firstPage.results ? [...firstPage.results] : (Array.isArray(firstPage) ? [...firstPage] : []);
  
  if (!firstPage.count) return results;

  // Use the actual number of items returned on the first page as our pageSize
  // The backend might cap the page_size (e.g., at 10) regardless of what we request.
  const actualPageSize = results.length;
  
  if (actualPageSize === 0 || firstPage.count <= actualPageSize) {
    return results;
  }

  const totalPages = Math.ceil(firstPage.count / actualPageSize);
  
  if (totalPages > 1) {
    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(getPlanYourTripRequests({ ...params, page: i }));
    }
    const pages = await Promise.all(promises);
    for (const page of pages) {
      if (page.results) results.push(...page.results);
      else if (Array.isArray(page)) results.push(...page);
    }
  }
  
  return results;
}

export async function getB2BRequests(params?: any): Promise<any> {
  return await adminDataClient.get('/requests/b2b-proposals/', { params });
}

export async function getB2BStats(params?: any): Promise<any> {
  return await adminDataClient.get('/requests/b2b-proposals/stats/', { params });
}

export async function getAllB2BRequests(params: any = {}): Promise<any[]> {
  const firstPage = await getB2BRequests(params);
  const results = firstPage.results ? [...firstPage.results] : (Array.isArray(firstPage) ? [...firstPage] : []);
  
  if (!firstPage.count) return results;

  const actualPageSize = results.length;
  if (actualPageSize === 0 || firstPage.count <= actualPageSize) {
    return results;
  }

  const totalPages = Math.ceil(firstPage.count / actualPageSize);
  
  if (totalPages > 1) {
    const promises = [];
    for (let page = 2; page <= totalPages; page++) {
      promises.push(getB2BRequests({ ...params, page }));
    }
    const pages = await Promise.all(promises);
    for (const page of pages) {
      if (page.results) results.push(...page.results);
      else if (Array.isArray(page)) results.push(...page);
    }
  }

  return results;
}

export async function getPlanYourTripStats(params?: any): Promise<any> {
  return await adminDataClient.get('/requests/plan-your-trip/stats/', { params });
}

export async function getPlanYourTripDetails(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/plan-your-trip/${id}/`);
}

export function createRequestActions(resourceBaseUrl: string) {
  return {
    async addNote(id: string | number, note: string) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/notes/`, { note });
    },
    async assign(id: string | number, assignee_id: string | number, reason?: string) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/assign/`, { assignee_id, reason });
    },
    async uploadProposal(id: string | number, file: File, notes: string = "") {
      const formData = new FormData();
      formData.append("file", file);
      if (notes) formData.append("notes", notes);
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/proposals/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    async markProposalSent(id: string | number, activity_note?: string) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/mark-proposal-sent/`, { activity_note });
    },
    async startNegotiation(id: string | number, negotiation_reason: string) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/start-negotiation/`, { negotiation_reason });
    },
    async reject(id: string | number, rejection_reason: string) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/reject/`, { rejection_reason });
    },
    async reopen(id: string | number, reopen_reason: string) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/reopen/`, { reopen_reason });
    },
    async approve(id: string | number, payload: any) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/approve/`, payload);
    },
    async recordPayment(id: string | number, payload: any) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/record-payment/`, payload);
    },
    async sendPaymentReminder(id: string | number, reminder_type: string) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/send-payment-reminder/`, { reminder_type });
    },
    async sendTripReminder(id: string | number) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/send-trip-reminder/`);
    },
    async cancel(id: string | number, cancellation_reason: string) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/cancel/`, { cancellation_reason });
    },
    async refund(id: string | number, payload: any) {
      const formData = new FormData();
      if (payload.transaction_ref) formData.append("transaction_ref", payload.transaction_ref);
      if (payload.notes) formData.append("notes", payload.notes);
      if (payload.file) formData.append("receipt_file", payload.file); // Assuming the backend wants receipt_file
      
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/refund/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    async completeTrip(id: string | number) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/complete-trip/`);
    }
  };
}

export const planYourTripActions = createRequestActions('/requests/plan-your-trip');
export const b2bActions = createRequestActions('/requests/b2b-proposals');
export const eventsActions = createRequestActions('/requests/mice-events');

export async function getPlanYourTripTimeline(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/plan-your-trip/${id}/timeline/`);
}

export async function getB2BDetails(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/b2b-proposals/${id}/`);
}

export async function getEventsDetails(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/mice-events/${id}/`);
}
