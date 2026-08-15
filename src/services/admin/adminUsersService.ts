import { adminDataClient } from '@/lib/adminCoreApi';

// ----------------------------------------------------------------------
// Users
// ----------------------------------------------------------------------

export async function getAdminUsers(params?: any): Promise<any> {
  return await adminDataClient.get('/users/', { params });
}

export async function createAdminUser(data: any): Promise<any> {
  return await adminDataClient.post('/users/', data);
}

export async function updateAdminUser(id: number, data: any): Promise<any> {
  return await adminDataClient.patch(`/users/${id}/`, data);
}

export async function deleteAdminUser(id: number): Promise<any> {
  return await adminDataClient.delete(`/users/${id}/`);
}

export async function exportAdminUsers(params?: Record<string, any>) {
  const response = await adminDataClient.get('/users/export/', {
    params,
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response as any]));
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `admin_users_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function getAdminRoles(): Promise<any> {
  return await adminDataClient.get('/roles/');
}

export async function createAdminRole(data: any): Promise<any> {
  return await adminDataClient.post('/roles/', data);
}

export async function updateAdminRole(id: number, data: any): Promise<any> {
  return await adminDataClient.patch(`/roles/${id}/`, data);
}

export async function deleteAdminRole(id: number): Promise<any> {
  return await adminDataClient.delete(`/roles/${id}/`);
}

export async function getAdminRoleModules(): Promise<any> {
  return await adminDataClient.get('/roles/modules/');
}
