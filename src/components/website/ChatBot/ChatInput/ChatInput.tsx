"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./ChatInput.module.scss";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <footer className={styles.footer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrap}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isLoading ? "Bot is responding..." : "Type a message..."}
            className={styles.input}
            disabled={isLoading}
            aria-label="Type a message to the travel assistant"
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!text.trim() || isLoading}
            aria-label="Send message"
            title="Send message"
          >
            <Image
              src="/images/send.svg"
              alt="Send"
              width={20}
              height={20}
              draggable={false}
            />
          </button>
        </div>
      </form>
    </footer>
  );
}
