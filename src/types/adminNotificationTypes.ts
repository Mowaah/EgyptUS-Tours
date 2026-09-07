export interface AdminNotificationItem {
  id: number;
  notification_type: string;
  title: string;
  body: string;
  resource_type: string;
  resource_id: number;
  reference_code: string | null;
  admin_path: string;
  permission_module: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminNotificationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminNotificationItem[];
}

export interface AdminNotificationUnreadCountResponse {
  count: number;
}

export interface AdminNotificationQueryParams {
  is_read?: boolean;
  category?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}
