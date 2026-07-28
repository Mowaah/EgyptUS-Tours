"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAssistantConfig,
  sendAssistantMessage,
  type AssistantConfig,
  type AssistantQuickReply,
  type AssistantCard,
  type AssistantEscalation,
} from "@/lib/api";

export interface ChatMessage {
  id: string | number;
  sender: "bot" | "user";
  text: string;
  cards?: AssistantCard[];
  escalation?: AssistantEscalation;
  timestamp: number;
}

const STORAGE_KEY = "egyptus_chat_history";

export function useAssistantChat() {
  const [config, setConfig] = useState<AssistantConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<AssistantQuickReply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial config and restore session storage if available
  useEffect(() => {
    let isMounted = true;

    async function initAssistant() {
      try {
        const conf = await getAssistantConfig();
        if (!isMounted) return;
        setConfig(conf);

        // Check if we have existing chat history in sessionStorage
        if (typeof window !== "undefined") {
          const saved = sessionStorage.getItem(STORAGE_KEY);
          if (saved) {
            try {
              const { messages: savedMsgs, quickReplies: savedQrs } = JSON.parse(saved);
              if (Array.isArray(savedMsgs) && savedMsgs.length > 0) {
                setMessages(savedMsgs);
                setQuickReplies(savedQrs || conf.quick_replies || []);
                return;
              }
            } catch (e) {
              console.error("Failed to parse chat history from sessionStorage", e);
            }
          }
        }

        // Initialize with default greeting if no history
        const initialMsg: ChatMessage = {
          id: Date.now(),
          sender: "bot",
          text: conf.greeting || "Hello! 👋 I'm EgyptUS Bot, your travel assistant. How can I help you today?",
          timestamp: Date.now(),
        };
        setMessages([initialMsg]);
        setQuickReplies(conf.quick_replies || []);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch assistant config", err);
        // Fallback offline greeting
        setMessages([
          {
            id: Date.now(),
            sender: "bot",
            text: "Hello! 👋 I'm EgyptUS Bot, your travel assistant. How can I help you today?",
            timestamp: Date.now(),
          },
        ]);
        setQuickReplies([
          { label: "What are your best hotel deals?", message: "What are your best hotel deals?" },
          { label: "Show me upcoming trips", message: "Show me upcoming trips" },
          { label: "Contact support", message: "Contact support" },
          { label: "Do you offer travel insurance?", message: "Do you offer travel insurance?" },
        ]);
      }
    }

    initAssistant();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save to sessionStorage whenever messages change
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ messages, quickReplies })
        );
      } catch (e) {
        console.error("Failed to save chat history to sessionStorage", e);
      }
    }
  }, [messages, quickReplies]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      const res = await sendAssistantMessage(text.trim(), currentPath);

      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: res.message,
        cards: res.cards && res.cards.length > 0 ? res.cards : undefined,
        escalation: res.escalation?.should_escalate ? res.escalation : undefined,
        timestamp: Date.now() + 1,
      };

      setMessages((prev) => [...prev, botMsg]);
      if (res.quick_replies && res.quick_replies.length > 0) {
        setQuickReplies(res.quick_replies);
      }
    } catch (err: any) {
      console.error("Assistant chat error:", err);
      
      const errorCode = err?.response?.data?.code;
      const rawDetail = typeof err?.response?.data?.detail === "string" ? err.response.data.detail : "";
      const isConfigError =
        errorCode === "assistant_openai_not_configured" ||
        rawDetail.toLowerCase().includes("openai") ||
        rawDetail.toLowerCase().includes("api_key") ||
        rawDetail.toLowerCase().includes("configured") ||
        rawDetail.toLowerCase().includes("package");

      const userFriendlyText = isConfigError
        ? "I am currently offline for scheduled maintenance and system upgrades. In the meantime, our travel specialists are available to assist you with any questions, custom itineraries, or bookings!"
        : "I'm experiencing temporary connectivity issues right now. Please feel free to reach out to our travel team directly or explore our luxury packages online!";

      const fallbackEscalation = {
        should_escalate: true,
        label: "Speak with a Specialist",
        message: "Our travel specialists are ready to help you plan your dream trip to Egypt.",
        href: "/contact",
      };

      const botErrorMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: userFriendlyText,
        escalation: fallbackEscalation,
        timestamp: Date.now() + 1,
      };
      setMessages((prev) => [...prev, botErrorMsg]);
      setError(userFriendlyText);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const resetChat = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    const initialMsg: ChatMessage = {
      id: Date.now(),
      sender: "bot",
      text: config?.greeting || "Hello! 👋 I'm EgyptUS Bot, your travel assistant. How can I help you today?",
      timestamp: Date.now(),
    };
    setMessages([initialMsg]);
    if (config?.quick_replies) {
      setQuickReplies(config.quick_replies);
    }
    setError(null);
  }, [config]);

  return {
    config,
    messages,
    quickReplies,
    isLoading,
    error,
    sendMessage,
    resetChat,
  };
}
