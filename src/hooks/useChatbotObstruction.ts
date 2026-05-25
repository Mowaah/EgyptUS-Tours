"use client";

import { useEffect, useState, type RefObject } from "react";

const MOBILE_MQ = "(max-width: 768px)";
const MIN_OVERLAP_PX = 24;

const OBSTRUCTIVE_SELECTOR = [
  "button:not(:disabled)",
  "a[href]",
  '[role="button"]:not([aria-disabled="true"])',
  'input[type="submit"]:not(:disabled)',
  'input[type="button"]:not(:disabled)',
].join(",");

function rectsOverlap(a: DOMRect, b: DOMRect): boolean {
  const overlapWidth = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const overlapHeight = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return overlapWidth >= MIN_OVERLAP_PX && overlapHeight >= MIN_OVERLAP_PX;
}

function isElementVisible(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;

  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (Number.parseFloat(style.opacity) === 0) return false;

  return true;
}

function isObstructedByInteractive(
  chatRect: DOMRect,
  chatRoot: HTMLElement
): boolean {
  const candidates = document.querySelectorAll<HTMLElement>(OBSTRUCTIVE_SELECTOR);

  for (const el of candidates) {
    if (chatRoot.contains(el)) continue;
    if (!isElementVisible(el)) continue;

    const rect = el.getBoundingClientRect();
    if (rectsOverlap(chatRect, rect)) return true;
  }

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

    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "disabled", "aria-hidden"],
    });

    return () => {
      cancelAnimationFrame(rafId);
      mq.removeEventListener("change", onMqChange);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      mutationObserver.disconnect();
    };
  }, [elementRef, enabled]);

  return isObstructed;
}
