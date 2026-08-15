import { adminDataClient } from "@/lib/adminCoreApi";

export interface AuditLogQuery {
  page?: number;
  search?: string;
  module?: string;
  action?: string;
  admin_user?: string;
}

export async function fetchAuditLogs(query?: AuditLogQuery): Promise<any> {
  return await adminDataClient.get('/audit-log/', { params: query });
}

export async function deleteAuditLog(id: number): Promise<any> {
  return await adminDataClient.delete(`/audit-log/${id}/`);
}

export async function exportAuditLogs(params?: Record<string, any>) {
  const response = await adminDataClient.get('/audit-log/export/', {
    params,
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response as any]));
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `audit_logs_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
