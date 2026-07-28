"use client";

import React from "react";
import Image from "next/image";
import styles from "./ChatHeader.module.scss";

interface ChatHeaderProps {
  status?: string;
  onClose: () => void;
  onReset: () => void;
}

export default function ChatHeader({ status = "online", onClose, onReset }: ChatHeaderProps) {
  const isOnline = status === "online";

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <Image
          src="/images/robot.svg"
          alt="Egypt US Bot"
          width={52}
          height={52}
          className={styles.headerBotIcon}
          draggable={false}
        />
        <div className={styles.botInfo}>
          <h3 className={styles.botName}>Egypt US Bot</h3>
          <div className={styles.statusRow}>
            <span>Your Travel Assistant</span>
            <div className={styles.onlineStatus}>
              <div className={`${styles.onlineDot} ${!isOnline ? styles.offline : ""}`} />
              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.headerActions}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onReset}
          title="Reset conversation"
          aria-label="Reset conversation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onClose}
          title="Close chat"
          aria-label="Close chat"
        >
          <Image src="/images/x-white.svg" alt="Close" width={12.73} height={12.73} />
        </button>
      </div>
    </header>
  );
}
