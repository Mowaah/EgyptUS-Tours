"use client";

import { useEffect } from "react";

// Elements that should NEVER be animated (navbars, overlays, fixed UI, etc.)
const SKIP_SELECTORS = [
  "nav",
  "header",
  "[data-no-animate]",    // escape hatch: add this attr to opt any element out
  ".chatbot",
  ".scrollToTop",
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

    const stamp = (el: HTMLElement, stagger = false) => {
      // Don't re-stamp or stamp excluded elements
      if (
        el.hasAttribute("data-animate") ||
        el.hasAttribute("data-animate-stagger") ||
        el.closest(SKIP_SELECTORS) ||
        el.matches(SKIP_SELECTORS)
      ) return;

      el.setAttribute(stagger ? "data-animate-stagger" : "data-animate", "");
    };

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
      // Animate the direct children of every <section> with a stagger
      document.querySelectorAll<HTMLElement>("section > *").forEach((child) => {
        stamp(child, false); // each block fades up individually
        observer.observe(child);
      });
    };

    observeAll();

    // Re-scan when React renders new content (route changes, modals, lazy loads)
    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}

