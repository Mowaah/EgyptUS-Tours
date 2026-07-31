import { adminDataClient } from '@/lib/adminCoreApi';

// ----------------------------------------------------------------------
// Users
// ----------------------------------------------------------------------

export async function getAdminUsers(params?: any): Promise<any> {
  return await adminDataClient.get('/users/', { params });
}
