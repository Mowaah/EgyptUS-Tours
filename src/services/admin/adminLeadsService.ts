import { adminDataClient } from "@/lib/adminCoreApi";
import type { 
  AdminLead, 
  AdminLeadCreatePayload, 
  AdminLeadUpdatePayload,
  AdminLeadTimelineEvent
} from "@/types/adminLeadTypes";

export async function fetchAdminLeads(params?: any): Promise<{ count: number; results: AdminLead[] }> {
  return await adminDataClient.get("/leads/", { params });
}

export async function exportAdminLeads(params?: any): Promise<Blob> {
  const response = await adminDataClient.get("/leads/export/", {
    params,
    responseType: "blob",
  });
  return response as unknown as Blob;
}

export async function getAdminLead(id: number): Promise<AdminLead> {
  return await adminDataClient.get(`/leads/${id}/`);
}

export async function createAdminLead(payload: AdminLeadCreatePayload): Promise<AdminLead> {
  return await adminDataClient.post("/leads/", payload);
}

export async function updateAdminLead(id: number, payload: AdminLeadUpdatePayload): Promise<AdminLead> {
  return await adminDataClient.patch(`/leads/${id}/`, payload);
}

export async function assignAdminLead(id: number, userId: number): Promise<AdminLead> {
  return await adminDataClient.post(`/leads/${id}/assign/`, { assignee_id: userId });
}

export async function closeAdminLead(id: number, reason: string): Promise<AdminLead> {
  return await adminDataClient.post(`/leads/${id}/close/`, { close_reason: reason });
}

export async function reopenAdminLead(id: number, reason: string): Promise<AdminLead> {
  return await adminDataClient.post(`/leads/${id}/reopen/`, { reopen_reason: reason });
}

export async function markAdminLeadContacted(id: number, contact_note: string = ""): Promise<AdminLead> {
  return await adminDataClient.post(`/leads/${id}/mark_contacted/`, { contact_note });
}

export async function markAdminLeadQualified(id: number, qualified_note: string = ""): Promise<AdminLead> {
  return await adminDataClient.post(`/leads/${id}/mark_qualified/`, { qualified_note });
}

export async function getAdminLeadTimeline(id: number): Promise<AdminLeadTimelineEvent[]> {
  return await adminDataClient.get(`/leads/${id}/timeline/`);
}

export async function addAdminLeadNote(id: number, note: string): Promise<AdminLeadTimelineEvent> {
  return await adminDataClient.post(`/leads/${id}/notes/`, { note });
}

export async function getAdminLeadStats(): Promise<any> {
  return await adminDataClient.get("/leads/stats/");
}

export async function convertAdminLead(id: number, note: string): Promise<AdminLead> {
  return await adminDataClient.post(`/leads/${id}/convert/`, { convert_note: note });
}

export async function fetchAdminLeadImportBatches(params?: any): Promise<{ count: number; results: any[] }> {
  return await adminDataClient.get("/leads/import-batches/", { params });
}

export async function getAdminLeadImportBatch(id: number): Promise<any> {
  return await adminDataClient.get(`/leads/import-batches/${id}/`);
}

export async function createAdminLeadImportBatch(file: File, assignees: number[]): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("assignee_ids", JSON.stringify(assignees));
  return await adminDataClient.post("/leads/import-batches/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function importAdminLeads(file: File, assignees: number[]): Promise<{
  batch_id: number;
  batch_code: string;
  validation: {
    total: number;
    valid: number;
    duplicate_in_file: number;
    duplicate_existing: number;
    invalid: number;
  };
  created_count: number;
  assigned_count: number;
}> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("assignee_ids", JSON.stringify(assignees));
  return await adminDataClient.post("/leads/import/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteAdminLeadImportBatch(id: number): Promise<void> {
  return await adminDataClient.delete(`/leads/import-batches/${id}/`);
}

export async function reassignAdminLeadImportBatch(id: number, memberId: number): Promise<any> {
  return await adminDataClient.post(`/leads/import-batches/${id}/reassign/`, { assignee_ids: [memberId], reassign_all: true });
}
