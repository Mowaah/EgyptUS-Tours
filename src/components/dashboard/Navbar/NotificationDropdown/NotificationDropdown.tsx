"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import styles from "./NotificationDropdown.module.scss";
import { initialNotifications, Notification } from "./mockNotifications";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
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
    setIsOpen(prev => !prev);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className={styles.wrapper}>
      <button
        ref={buttonRef}
        className={styles.notificationButton}
        type="button"
        aria-label="Notifications"
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

      {isOpen && typeof document !== "undefined" && createPortal(
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(8, 7, 66, 0.08)',
              zIndex: 9990,
            }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={dropdownRef}
            className={styles.dropdownContainer}
            style={{
              position: 'fixed',
              top: coords.top,
              right: coords.right,
              zIndex: 9999,
            }}
          >
            <div className={styles.tooltip}>
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <div className={styles.iconWrapper}>
                    <Image src="/images/dashboard/navbar/notification-bing.svg" alt="Notifications" width={20} height={20} />
                  </div>
                  <h3 className={styles.title}>Notifications</h3>
                </div>
                <button className={styles.markReadBtn} onClick={markAllAsRead}>
                  Mark all as readed
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#FF6600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path opacity="0.34" d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#FF6600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className={styles.list}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${notification.isRead ? styles.read : styles.unread}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className={styles.itemHeader}>
                      <h4 className={styles.itemTitle}>{notification.title}</h4>
                      {!notification.isRead && <div className={styles.unreadDot} />}
                    </div>
                    <p className={styles.itemDesc}>{notification.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
