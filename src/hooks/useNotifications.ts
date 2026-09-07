import useSWR from "swr";
import { useCallback } from "react";
import {
  getAdminNotifications,
  getAdminNotificationUnreadCount,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
} from "@/services/admin/adminNotificationsService";
import type {
  AdminNotificationItem,
  AdminNotificationListResponse,
  AdminNotificationUnreadCountResponse,
} from "@/types/adminNotificationTypes";

const UNREAD_COUNT_KEY = ["adminNotifications", "unreadCount"];

export interface UseNotificationsOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
}

export function useNotifications(options?: UseNotificationsOptions) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;
  const category = options?.category;
  const search = options?.search;

  const listKey = [
    "adminNotifications",
    "list",
    page,
    pageSize,
    category || "all",
    search || "",
  ];

  const {
    data: unreadData,
    mutate: mutateUnread,
    error: unreadError,
  } = useSWR<AdminNotificationUnreadCountResponse>(
    UNREAD_COUNT_KEY,
    getAdminNotificationUnreadCount,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  );

  const {
    data: listData,
    mutate: mutateList,
    isLoading: isListLoading,
    error: listError,
  } = useSWR<AdminNotificationListResponse>(
    listKey,
    () =>
      getAdminNotifications({
        page,
        page_size: pageSize,
        ordering: "-created_at,-id",
        ...(category && category !== "all" ? { category } : {}),
        ...(search ? { search } : {}),
      }),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  );

  const unreadCount = unreadData?.count ?? 0;
  const notifications: AdminNotificationItem[] = listData?.results ?? [];
  const totalCount = listData?.count ?? notifications.length;

  const markAsRead = useCallback(
    async (id: number) => {
      const targetItem = notifications.find((n) => n.id === id);
      const wasUnread = targetItem ? !targetItem.is_read : false;

      // Optimistic update for notifications list
      mutateList(
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            results: prev.results.map((n) =>
              n.id === id ? { ...n, is_read: true } : n
            ),
          };
        },
        false
      );

      // Optimistic update for unread count
      if (wasUnread) {
        mutateUnread(
          (prev) => ({
            count: Math.max(0, (prev?.count ?? 1) - 1),
          }),
          false
        );
      }

      try {
        await markAdminNotificationAsRead(id);
      } catch (error) {
        mutateList();
        mutateUnread();
        throw error;
      }
    },
    [notifications, mutateList, mutateUnread]
  );

  const markAllAsRead = useCallback(async () => {
    // Optimistically mark all in list as read
    mutateList(
      (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          results: prev.results.map((n) => ({ ...n, is_read: true })),
        };
      },
      false
    );

    // Optimistically set unread count to 0
    mutateUnread({ count: 0 }, false);

    try {
      await markAllAdminNotificationsAsRead();
    } catch (error) {
      mutateList();
      mutateUnread();
      throw error;
    }
  }, [mutateList, mutateUnread]);

  return {
    unreadCount,
    notifications,
    totalCount,
    isLoading: isListLoading,
    isError: Boolean(unreadError || listError),
    markAsRead,
    markAllAsRead,
    refetch: () => {
      mutateUnread();
      mutateList();
    },
  };
}
