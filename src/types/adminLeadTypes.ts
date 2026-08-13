export interface AdminLeadAssignedTo {
  id: number;
  full_name: string;
  profile_picture?: string;
}

export interface AdminLeadCreatedBy {
  id: number;
  full_name: string;
  profile_picture?: string;
}

export interface AdminLead {
  id: number;
  display_id: string;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  company_name: string;
  source: string;
  status: string;
  batch_code: string;
  assigned_to: AdminLeadAssignedTo | null;
  created_at: string;
  
  // Detail fields
  linkedin_url?: string;
  website?: string;
  close_reason?: string;
  reopen_reason?: string;
  converted_custom_trip_request_id?: number;
  converted_at?: string;
  created_by?: AdminLeadCreatedBy | null;
  updated_at?: string;
}

export interface AdminLeadCreatePayload {
  full_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  company_name?: string;
  linkedin_url?: string;
  website?: string;
  source?: string;
  assigned_to_id?: number | null;
  note?: string;
}

export interface AdminLeadUpdatePayload {
  full_name?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  company_name?: string;
  linkedin_url?: string;
  website?: string;
  source?: string;
}

export interface AdminLeadTimelineEvent {
  id: number;
  activity_type: string;
  description: string;
  created_at: string;
  created_by: AdminLeadCreatedBy | null;
}

export interface AdminLeadImportBatchAssignee {
  id: number;
  full_name: string;
  profile_picture: string | null;
  team: string;
  assigned_count: number;
}

export interface AdminLeadImportBatch {
  id: number;
  batch_code: string;
  import_date: string;
  filename: string;
  imported_by: AdminLeadCreatedBy | null;
  total_leads: number;
  assigned_count: number;
  unassigned_count: number;
  assigned_teams: string[];
  row_count: number;
  created_at: string;
  assignees?: AdminLeadImportBatchAssignee[];
}