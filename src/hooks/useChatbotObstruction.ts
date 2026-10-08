"use client";

import { useEffect, useState, type RefObject } from "react";

const MOBILE_MQ = "(max-width: 768px)";

const OBSTRUCTIVE_SELECTOR = [
  "button:not(:disabled)",
  "a[href]",
  '[role="button"]:not([aria-disabled="true"])',
  'input[type="submit"]:not(:disabled)',
  'input[type="button"]:not(:disabled)',
].join(",");


function isPointObstructed(x: number, y: number, chatRoot: HTMLElement): boolean {
  if (typeof document.elementsFromPoint !== "function") return false;
  const elements = document.elementsFromPoint(x, y);
  for (const el of elements) {
    if (chatRoot.contains(el)) continue;
    if (el.matches(OBSTRUCTIVE_SELECTOR) || el.closest(OBSTRUCTIVE_SELECTOR)) {
      return true;
    }
  }
  return false;
}

function isObstructedByInteractive(
  chatRect: DOMRect,
  chatRoot: HTMLElement
): boolean {
  // Check center and boundary points of the chat trigger
  const midX = chatRect.left + chatRect.width / 2;
  const midY = chatRect.top + chatRect.height / 2;

  if (isPointObstructed(midX, midY, chatRoot)) return true;
  if (isPointObstructed(chatRect.left + 12, chatRect.top + 12, chatRoot)) return true;
  if (isPointObstructed(chatRect.right - 12, chatRect.bottom - 12, chatRoot)) return true;

  return false;
}

/**
 * On mobile, fades the chatbot trigger when it visually overlaps page buttons/links
 * so underlying controls stay tappable (pointer-events are disabled while hidden).
 */
export function useChatbotObstruction(
  elementRef: RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const [isObstructed, setIsObstructed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsObstructed(false);
      return;
    }

    const mq = window.matchMedia(MOBILE_MQ);
    let rafId = 0;

    const evaluate = () => {
      if (!mq.matches) {
        setIsObstructed(false);
        return;
      }

      const el = elementRef.current;
      if (!el) {
        setIsObstructed(false);
        return;
      }

      const chatRoot = el.closest("[data-chatbot-root]") as HTMLElement | null;
      if (!chatRoot) {
        setIsObstructed(false);
        return;
      }

      setIsObstructed(isObstructedByInteractive(el.getBoundingClientRect(), chatRoot));
    };

    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(evaluate);
    };

    const onMqChange = () => schedule();

    schedule();

    mq.addEventListener("change", onMqChange);
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(rafId);
      mq.removeEventListener("change", onMqChange);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [elementRef, enabled]);

  return isObstructed;
}
