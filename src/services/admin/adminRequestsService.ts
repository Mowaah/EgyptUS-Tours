import { adminDataClient } from '@/lib/adminCoreApi';

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

export async function exportPlanYourTripCSV(params?: any): Promise<Blob> {
  return await adminDataClient.get('/requests/plan-your-trip/export/', { 
    params, 
    responseType: 'blob' 
  });
}

export async function getB2BRequests(params?: any): Promise<any> {
  return await adminDataClient.get('/requests/b2b-proposals/', { params });
}

export async function getB2BStats(params?: any): Promise<any> {
  return await adminDataClient.get('/requests/b2b-proposals/stats/', { params });
}

export async function exportB2BCSV(params?: any): Promise<Blob> {
  return await adminDataClient.get('/requests/b2b-proposals/export/', { 
    params, 
    responseType: 'blob' 
  });
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

export async function getMiceRequests(params?: any): Promise<any> {
  return await adminDataClient.get('/requests/mice-events/', { params });
}

export async function getMiceStats(params?: any): Promise<any> {
  return await adminDataClient.get('/requests/mice-events/stats/', { params });
}

export async function exportMiceCSV(params?: any): Promise<Blob> {
  return await adminDataClient.get('/requests/mice-events/export/', { 
    params, 
    responseType: 'blob' 
  });
}

export async function getAllMiceRequests(params: any = {}): Promise<any[]> {
  const firstPage = await getMiceRequests(params);
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
      promises.push(getMiceRequests({ ...params, page }));
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

export async function getContactUsRequests(params?: any): Promise<any> {
  return await adminDataClient.get('/requests/contact-us/', { params });
}

export async function getContactUsStats(params?: any): Promise<any> {
  return await adminDataClient.get('/requests/contact-us/stats/', { params });
}

export async function exportContactUsCSV(params?: any): Promise<Blob> {
  return await adminDataClient.get('/requests/contact-us/export/', { 
    params, 
    responseType: 'blob' 
  });
}

export async function getAllContactUsRequests(params: any = {}): Promise<any[]> {
  const firstPage = await getContactUsRequests(params);
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
      promises.push(getContactUsRequests({ ...params, page }));
    }
    const pages = await Promise.all(promises);
    for (const page of pages) {
      if (page.results) results.push(...page.results);
      else if (Array.isArray(page)) results.push(...page);
    }
  }

  return results;
}

export async function getContactUsDetails(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/contact-us/${id}/`);
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
      try {
        return await adminDataClient.post(`${resourceBaseUrl}/${id}/approve/`, payload);
      } catch (err: any) {
        console.error("Approve error payload:", payload);
        console.error("Approve error response:", err.response?.data);
        throw err;
      }
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
      if (payload.transaction_reference) formData.append("transaction_reference", payload.transaction_reference);
      if (payload.notes) formData.append("notes", payload.notes);
      if (payload.file) formData.append("receipt_file", payload.file); // Assuming the backend wants receipt_file
      
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/refund/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    async completeTrip(id: string | number) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/complete-trip/`);
    },
    async reply(id: string | number, message: string) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/reply/`, { message });
    },
    async close(id: string | number, note: string) {
      return await adminDataClient.post(`${resourceBaseUrl}/${id}/close/`, { note });
    }
  };
}

export const planYourTripActions = createRequestActions('/requests/plan-your-trip');
export const b2bActions = createRequestActions('/requests/b2b-proposals');
export const eventsActions = createRequestActions('/requests/mice-events');
export const contactUsActions = createRequestActions('/requests/contact-us');

export async function getPlanYourTripTimeline(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/plan-your-trip/${id}/timeline/`);
}

export async function getMiceTimeline(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/mice-events/${id}/timeline/`);
}

export async function getB2BTimeline(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/b2b-proposals/${id}/timeline/`);
}

export async function getContactUsTimeline(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/contact-us/${id}/timeline/`);
}

export async function getB2BDetails(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/b2b-proposals/${id}/`);
}

export async function getEventsDetails(id: number | string): Promise<any> {
  return await adminDataClient.get(`/requests/mice-events/${id}/`);
}
