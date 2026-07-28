"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useChatbotObstruction } from "@/hooks/useChatbotObstruction";
import { useAssistantChat } from "@/hooks/useAssistantChat";
import ChatHeader from "./ChatHeader/ChatHeader";
import ChatMessageList from "./ChatMessageList/ChatMessageList";
import ChatInput from "./ChatInput/ChatInput";
import styles from "./ChatBot.module.scss";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const {
    config,
    messages,
    quickReplies,
    isLoading,
    sendMessage,
    resetChat,
  } = useAssistantChat();

  const closeTimerRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isObstructed = useChatbotObstruction(triggerRef, !isOpen);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openChat = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsClosing(false);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    if (!isOpen || isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, 250); // Matches 0.25s animation
  }, [isOpen, isClosing]);

  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isOpen, closeChat, openChat]);

  return (
    <div
      className={`${styles.chatbotContainer} ${isObstructed ? styles.obstructed : ""}`}
      data-chatbot-root
    >
      {/* Chat Window */}
      {isOpen && (
        <div className={`${styles.chatWindow} ${isClosing ? styles.chatWindowClosing : ""}`}>
          <ChatHeader
            status={config?.status || "online"}
            onClose={closeChat}
            onReset={resetChat}
          />

          <ChatMessageList
            messages={messages}
            quickReplies={quickReplies}
            isLoading={isLoading}
            onSelectQuickReply={sendMessage}
          />

          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={toggleChat}
        aria-label={isOpen ? "Close travel assistant chat" : "Open travel assistant chat"}
        aria-expanded={isOpen}
      >
        <Image
          src="/images/robot.svg"
          alt="Egypt US Bot"
          width={77.5}
          height={77.5}
          className={styles.triggerIcon}
          draggable={false}
        />
      </button>
    </div>
  );
}
