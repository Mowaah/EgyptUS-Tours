import { adminDataClient } from "@/lib/adminCoreApi";

export interface SystemConfigResponse {
  id: number;
  company_name: string;
  contact_email: string;
  phone: string;
  address: string;
  logo: string | null;
  updated_at: string;
}

export interface SystemConfigUpdatePayload {
  company_name?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  logo?: string | null;
}

export const getSystemConfig = async (): Promise<SystemConfigResponse> => {
  const response = await adminDataClient.get("/system-config/");
  return response as unknown as SystemConfigResponse;
};

export const updateSystemConfig = async (payload: SystemConfigUpdatePayload): Promise<SystemConfigResponse> => {
  const response = await adminDataClient.patch("/system-config/", payload);
  return response as unknown as SystemConfigResponse;
};
