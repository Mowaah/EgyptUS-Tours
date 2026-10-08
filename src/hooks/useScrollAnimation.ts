"use client";

import { useEffect } from "react";

// Elements that should NEVER be animated (navbars, overlays, fixed UI, etc.)
const SKIP_SELECTORS = [
  "nav",
  "header",
  "[data-no-animate]",    // escape hatch: add this attr to opt any element out
  ".chatbot",
  ".scrollToTop",
  "section:first-of-type", // hero has its own CSS keyframe animation
].join(", ");

/**
 * Auto-animates the entire site on scroll without any manual attributes.
 *
 * Strategy:
 *  1. Every <section> element gets a fade-up animation as a whole.
 *  2. The direct children of each section ALSO get staggered fade-ups
 *     so inner blocks (headings, grids, cards) reveal nicely.
 *  3. Elements matching SKIP_SELECTORS are ignored.
 *
 * Escape hatch: add `data-no-animate` to any element to exclude it.
 */
export function useScrollAnimation() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const reveal = (el: Element) => {
      if (el.hasAttribute("data-animate")) {
        el.setAttribute("data-animate", "visible");
      } else if (el.hasAttribute("data-animate-stagger")) {
        el.setAttribute("data-animate-stagger", "visible");
      }
    };

    // Fallback for browsers without IntersectionObserver support
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>(
        "[data-animate], [data-animate-stagger]"
      ).forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target); // animate once only
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const observeAll = () => {
      const sections = document.querySelectorAll<HTMLElement>("section");
      sections.forEach((section, idx) => {
        if (idx === 0 || section.matches(SKIP_SELECTORS) || section.closest(SKIP_SELECTORS)) return;
        const children = section.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          if (
            !child ||
            child.hasAttribute("data-animate") ||
            child.hasAttribute("data-animate-stagger") ||
            child.matches(SKIP_SELECTORS)
          ) {
            continue;
          }
          child.setAttribute("data-animate", "");
          observer.observe(child);
        }
      });
    };

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleObserve = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(observeAll, 400);
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => scheduleObserve(), { timeout: 1500 });
    } else {
      scheduleObserve();
    }

    // Re-scan when React renders new content (route changes, modals, lazy loads)
    const mutationObserver = new MutationObserver(scheduleObserve);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);
}

