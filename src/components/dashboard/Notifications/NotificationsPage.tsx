"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardTabs, { TabConfig } from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { useNotifications } from "@/hooks/useNotifications";
import { formatNotificationDateTime } from "@/utils/formatRelativeTime";
import type { AdminNotificationItem } from "@/types/adminNotificationTypes";
import styles from "./NotificationsPage.module.scss";

const NOTIFICATION_TABS: TabConfig[] = [
  { id: "all", label: "All", iconSrc: "/images/dashboard/notifications/all.svg" },
  { id: "booking", label: "Booking", iconSrc: "/images/dashboard/notifications/booking.svg" },
  { id: "request", label: "Request", iconSrc: "/images/dashboard/notifications/request.svg" },
  { id: "payment", label: "Payment", iconSrc: "/images/dashboard/notifications/payment.svg" },
];

const PAGE_SIZE_OPTIONS = [3, 5, 10, 15];

interface NotificationsPageProps {
  initialSearch?: string;
}

export default function NotificationsPage({ initialSearch = "" }: NotificationsPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const {
    notifications,
    totalCount,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications({
    page,
    pageSize: rowsPerPage,
    category: activeTab,
    search: searchQuery,
  });

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setPage(1);
  }, []);

  const handleRowsPerPageChange = useCallback((rows: number) => {
    setRowsPerPage(rows);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const pageCount = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  const handleNotificationClick = (notification: AdminNotificationItem) => {
    if (!notification.is_read) {
      markAsRead(notification.id).catch(() => {});
    }
    if (notification.admin_path) {
      router.push(notification.admin_path);
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead().catch(() => {});
    }
  };

  return (
    <>
      <DashboardNavbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className={styles.pageWrapper}>
        <DashboardTabs
          tabs={NOTIFICATION_TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          ariaLabel="Notification categories"
        />

        <div className={styles.tableContainer}>
          <div className={styles.header}>
            <div className={styles.titleArea}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/images/dashboard/navbar/notification-bing.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden
                />
              </div>
              <h2 className={styles.titleText}>Notifications</h2>
            </div>

            <button
              type="button"
              className={styles.markAllBtn}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                  stroke="#FF6600"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  opacity="0.34"
                  d="M7.75 12L10.58 14.83L16.25 9.17"
                  stroke="#FF6600"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Mark All As Read
            </button>
          </div>

          {isLoading && notifications.length === 0 ? (
            <div className={styles.skeletonList}>
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className={styles.skeletonCard} />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            searchQuery ? (
              <DashboardSearchEmptyState
                onClearSearch={() => handleSearchChange("")}
              />
            ) : (
              <DashboardEmptyState
                title="No Notifications Found"
                subtitle="You don't have any notifications in this category yet."
              />
            )
          ) : (
            <div className={styles.notificationsList}>
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.notificationCard} ${
                    item.is_read ? styles.read : styles.unread
                  }`}
                  onClick={() => handleNotificationClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNotificationClick(item);
                    }
                  }}
                >
                  <div className={styles.cardContent}>
                    <h4
                      className={`${styles.cardTitle} ${
                        item.is_read ? styles.readTitle : ""
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p className={styles.cardBody}>{item.body}</p>
                  </div>

                  {item.created_at && (
                    <div className={styles.cardTimestamp}>
                      {formatNotificationDateTime(item.created_at)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {totalCount > 0 && (
            <div className={styles.paginationWrapper}>
              <TablePagination
                page={page}
                pageCount={pageCount}
                rowsPerPage={rowsPerPage}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onChangePage={setPage}
                onChangeRowsPerPage={handleRowsPerPageChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
