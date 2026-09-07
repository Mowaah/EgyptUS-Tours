"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./NotificationDropdown.module.scss";
import { useNotifications } from "@/hooks/useNotifications";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import type { AdminNotificationItem } from "@/types/adminNotificationTypes";

export default function NotificationDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    unreadCount,
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const visibleNotifications = notifications.slice(0, 4);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 16,
        right: window.innerWidth - rect.right - 8,
      });
    }
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (notification: AdminNotificationItem) => {
    if (!notification.is_read) {
      markAsRead(notification.id).catch(() => {
        // Handled internally in hook
      });
    }
    setIsOpen(false);
    if (notification.admin_path) {
      router.push(notification.admin_path);
    }
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unreadCount > 0) {
      markAllAsRead().catch(() => {
        // Handled internally in hook
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        ref={buttonRef}
        className={styles.notificationButton}
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleDropdown}
      >
        <Image
          src="/images/dashboard/navbar/notification-bing.svg"
          alt=""
          width={24}
          height={24}
          className={styles.notificationIcon}
          aria-hidden
        />
        {unreadCount > 0 && (
          <span
            className={styles.notificationDot}
            aria-hidden="true"
          />
        )}
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(8, 7, 66, 0.08)",
                zIndex: 9990,
              }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div
              ref={dropdownRef}
              className={styles.dropdownContainer}
              style={{
                position: "fixed",
                top: coords.top,
                right: coords.right,
                zIndex: 9999,
              }}
              role="region"
              aria-label="Notifications dropdown"
            >
              <div className={styles.tooltip}>
                <div className={styles.header}>
                  <div className={styles.headerLeft}>
                    <div className={styles.iconWrapper}>
                      <Image
                        src="/images/dashboard/navbar/notification-bing.svg"
                        alt=""
                        width={20}
                        height={20}
                        aria-hidden
                      />
                    </div>
                    <h3 className={styles.title}>Notifications</h3>
                  </div>
                  <button
                    className={styles.markReadBtn}
                    onClick={handleMarkAllAsRead}
                    type="button"
                    disabled={unreadCount === 0}
                  >
                    Mark all as read
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
                  </button>
                </div>

                {isLoading && notifications.length === 0 ? (
                  <div className={styles.skeletonList}>
                    {[1, 2, 3, 4].map((key) => (
                      <div key={key} className={styles.skeletonCard}>
                        <div className={styles.skeletonLineTitle} />
                        <div className={styles.skeletonLineDesc} />
                      </div>
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIconWrapper}>
                      <Image
                        src="/images/dashboard/navbar/notification-bing.svg"
                        alt=""
                        width={24}
                        height={24}
                        aria-hidden
                      />
                    </div>
                    <p className={styles.emptyText}>No notifications yet</p>
                  </div>
                ) : (
                  <div className={styles.list}>
                    {visibleNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`${styles.notificationItem} ${
                          notification.is_read ? styles.read : styles.unread
                        }`}
                        onClick={() => handleItemClick(notification)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleItemClick(notification);
                          }
                        }}
                      >
                        <div className={styles.itemHeader}>
                          <h4 className={styles.itemTitle}>
                            {notification.title}
                          </h4>
                          <div className={styles.itemHeaderRight}>
                            {notification.created_at && (
                              <span className={styles.itemTime}>
                                {formatRelativeTime(notification.created_at)}
                              </span>
                            )}
                            {!notification.is_read && (
                              <div
                                className={styles.unreadDot}
                                aria-label="Unread notification"
                              />
                            )}
                          </div>
                        </div>
                        <p className={styles.itemDesc}>{notification.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.footer}>
                  <button
                    type="button"
                    className={styles.viewAllBtn}
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/dashboard/notifications");
                    }}
                  >
                    View All Notifications
                    <Image
                      src="/images/dashboard/notifications/arrow.svg"
                      alt=""
                      width={19}
                      height={20}
                      aria-hidden
                    />
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
