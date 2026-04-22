"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./ChatBot.module.scss";

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 I'm EgyptBot, your travel assistant. How can I help you today?",
    },
  ]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragPointerId = useRef<number | null>(null);
  const dragOrigin = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const didDrag = useRef(false);
  const suppressClick = useRef(false);
  const closeTimerRef = useRef<number | null>(null);

  const clampPosition = (nextX: number, nextY: number) => {
    const container = containerRef.current;
    if (!container) return { x: nextX, y: nextY };

    const rect = container.getBoundingClientRect();
    const baseLeft = rect.left - position.x;
    const baseTop = rect.top - position.y;
    const minX = -baseLeft;
    const maxX = window.innerWidth - (baseLeft + rect.width);
    const minY = -baseTop;
    const maxY = window.innerHeight - (baseTop + rect.height);

    return {
      x: Math.min(Math.max(nextX, minX), maxX),
      y: Math.min(Math.max(nextY, minY), maxY),
    };
  };

  const handleDragStart = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();

    dragPointerId.current = e.pointerId;
    didDrag.current = false;
    setIsDragging(true);

    dragOrigin.current = {
      x: e.clientX,
      y: e.clientY,
      startX: position.x,
      startY: position.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: React.PointerEvent<HTMLElement>) => {
    if (dragPointerId.current !== e.pointerId) return;

    const deltaX = e.clientX - dragOrigin.current.x;
    const deltaY = e.clientY - dragOrigin.current.y;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      didDrag.current = true;
    }

    const next = clampPosition(
      dragOrigin.current.startX + deltaX,
      dragOrigin.current.startY + deltaY
    );
    setPosition(next);
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLElement>) => {
    if (dragPointerId.current !== e.pointerId) return;

    e.currentTarget.releasePointerCapture(e.pointerId);
    dragPointerId.current = null;
    setIsDragging(false);

    if (didDrag.current) {
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openChat = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsClosing(false);
    setIsOpen(true);
  };

  const closeChat = () => {
    if (!isOpen || isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, 500);
  };

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const handleToggleChat = () => {
    if (suppressClick.current) return;
    toggleChat();
  };

  const handleSuggestion = (suggestion: string) => {
    const userMsg: Message = { id: Date.now(), sender: "user", text: suggestion };
    setMessages((prev) => [...prev, userMsg]);

    if (suggestion === "Show me upcoming trips") {
      setTimeout(() => {
        const botReply: Message = {
          id: Date.now() + 1,
          sender: "bot",
          text: "We have several exciting trips coming up! Head to the Trips tab to explore options like Greek Island Hopping and Safari Adventures. Our next departure is April 15th!",
        };
        setMessages((prev) => [...prev, botReply]);
      }, 600);
    }
  };

  const suggestions = [
    "What are your best hotel deals?",
    "Show me upcoming trips",
    "Contact support",
    "Do you offer travel insurance?",
  ];

  return (
    <div
      ref={containerRef}
      className={styles.chatbotContainer}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {/* Chat Window */}
      {isOpen && (
        <div className={`${styles.chatWindow} ${isClosing ? styles.chatWindowClosing : ""}`}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <Image
                src="/images/robot.svg"
                alt="Bot"
                width={52}
                height={52}
                className={styles.headerBotIcon}
                draggable={false}
              />
              <div className={styles.botInfo}>
                <h3 className={styles.botName}>Egypt Us Bot</h3>
                <div className={styles.statusRow}>
                  <span>Your travel assistant</span>
                  <div className={styles.onlineStatus}>
                    <div className={styles.onlineDot} />
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={closeChat}>
              <Image src="/images/x-white.svg" alt="Close" width={12.73} height={12.73} />
            </button>
          </header>

          <div className={styles.chatBody}>
            {messages.map((m) => (
              <div key={m.id} className={`${styles.messageRow} ${m.sender === "user" ? styles.userRow : ""}`}>
                {m.sender === "bot" && (
                  <div className={styles.miniAvatar}>
                    <Image src="/images/robot.svg" alt="" width={32} height={32} />
                  </div>
                )}
                <div className={m.sender === "bot" ? styles.botMessage : styles.userMessage}>
                  {m.text}
                </div>
              </div>
            ))}

            <div className={styles.suggestions}>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  className={styles.suggestionPill}
                  onClick={() => handleSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <footer className={styles.footer}>
            <div className={styles.inputWrap}>
              <input type="text" placeholder="Type a message" className={styles.input} />
              <button className={styles.sendBtn}>
                <Image src="/images/send.svg" alt="Send" width={21.67} height={21.67} />
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* Trigger Button */}
      <button
        className={`${styles.trigger} ${styles.dragHandle} ${isDragging ? styles.dragging : ""}`}
        onClick={handleToggleChat}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        aria-label="Open chat"
      >
        <Image
          src="/images/robot.svg"
          alt="Chat Bot"
          width={77.5}
          height={77.5}
          className={styles.triggerIcon}
          draggable={false}
        />
      </button>
    </div>
  );
}
