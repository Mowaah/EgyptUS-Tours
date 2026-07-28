"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ChatMessage } from "@/hooks/useAssistantChat";
import type { AssistantQuickReply } from "@/lib/api";
import ChatCardItem from "../ChatCardItem/ChatCardItem";
import styles from "./ChatMessageList.module.scss";

interface ChatMessageListProps {
  messages: ChatMessage[];
  quickReplies: AssistantQuickReply[];
  isLoading: boolean;
  onSelectQuickReply: (text: string) => void;
}

export default function ChatMessageList({
  messages,
  quickReplies,
  isLoading,
  onSelectQuickReply,
}: ChatMessageListProps) {
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <div ref={chatBodyRef} className={styles.chatBody} role="log" aria-live="polite">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`${styles.messageRow} ${m.sender === "user" ? styles.userRow : ""}`}
        >
          {m.sender === "bot" && (
            <div className={styles.miniAvatar}>
              <Image
                src="/images/robot.svg"
                alt="Bot Avatar"
                width={32}
                height={32}
                draggable={false}
              />
            </div>
          )}

          {m.sender === "user" ? (
            <div className={styles.userMessage}>{m.text}</div>
          ) : (
            <div className={styles.botContentWrap}>
              {m.text && <div className={styles.botMessage}>{m.text}</div>}

              {/* Product Cards */}
              {m.cards && m.cards.length > 0 && (
                <div className={styles.cardsGrid}>
                  {m.cards.map((card, idx) => (
                    <ChatCardItem key={`${card.id}-${idx}`} card={card} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Typing Indicator */}
      {isLoading && (
        <div className={styles.messageRow}>
          <div className={styles.miniAvatar}>
            <Image
              src="/images/robot.svg"
              alt="Bot Typing"
              width={32}
              height={32}
              draggable={false}
            />
          </div>
          <div className={styles.typingIndicator} aria-label="Bot is typing">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </div>
      )}

      {/* Quick Replies Pill Suggestions */}
      {!isLoading && quickReplies.length > 0 && (
        <div className={styles.suggestions}>
          {quickReplies.map((qr, idx) => {
            const isContactLink =
              qr.label.toLowerCase().includes("contact page") ||
              qr.message.toLowerCase().includes("contact page") ||
              qr.message === "/contact";

            if (isContactLink) {
              return (
                <Link
                  key={`${qr.label}-${idx}`}
                  href="/contact"
                  className={styles.suggestionPill}
                  style={{ textDecoration: "none", display: "inline-block" }}
                >
                  {qr.label}
                </Link>
              );
            }

            return (
              <button
                key={`${qr.label}-${idx}`}
                type="button"
                className={styles.suggestionPill}
                onClick={() => onSelectQuickReply(qr.message)}
                disabled={isLoading}
              >
                {qr.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
