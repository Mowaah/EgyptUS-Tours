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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 I'm EgyptBot, your travel assistant. How can I help you today?",
    },
  ]);

  const closeTimerRef = useRef<number | null>(null);

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
    <div className={styles.chatbotContainer}>
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
        className={styles.trigger}
        onClick={toggleChat}
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
