import { adminDataClient } from "@/lib/adminCoreApi";
import type {
  AdminNotificationItem,
  AdminNotificationListResponse,
  AdminNotificationUnreadCountResponse,
  AdminNotificationQueryParams,
} from "@/types/adminNotificationTypes";

export async function getAdminNotifications(
  params?: AdminNotificationQueryParams
): Promise<AdminNotificationListResponse> {
  return await adminDataClient.get("/notifications/", { params });
}

export async function getAdminNotificationUnreadCount(): Promise<AdminNotificationUnreadCountResponse> {
  return await adminDataClient.get("/notifications/unread-count/");
}

export async function markAdminNotificationAsRead(
  id: number | string
): Promise<AdminNotificationItem> {
  return await adminDataClient.post(`/notifications/${id}/mark-read/`);
}

export async function markAllAdminNotificationsAsRead(): Promise<{ marked_count: number }> {
  return await adminDataClient.post("/notifications/mark-all-read/");
}
