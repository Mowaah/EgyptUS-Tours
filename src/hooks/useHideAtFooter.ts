"use client";

import { useEffect, useState } from "react";

/**
 * Detects when the user has scrolled to the page footer on mobile/small screens.
 * Returns `true` when the footer is visible in the viewport so fixed bottom
 * widgets can hide and avoid obstructing footer content.
 */
export function useHideAtFooter(): boolean {
  const [isAtFooter, setIsAtFooter] = useState(false);

  useEffect(() => {
    const getFooter = () =>
      document.getElementById("site-footer") || document.querySelector("footer");

    let footer = getFooter();

    if (typeof IntersectionObserver === "undefined") {
      const handleScroll = () => {
        footer = footer || getFooter();
        if (!footer) return;
        const rect = footer.getBoundingClientRect();
        setIsAtFooter(rect.top < window.innerHeight);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtFooter(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    if (footer) {
      observer.observe(footer);
    } else {
      const raf = requestAnimationFrame(() => {
        footer = getFooter();
        if (footer) observer.observe(footer);
      });
      return () => {
        cancelAnimationFrame(raf);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, []);

  return isAtFooter;
}
