"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    // Prevent the browser from automatically jumping to the previous scroll position on reload
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Temporarily disable smooth scrolling to allow an instant jump to top
    // (CSS scroll-behavior: smooth breaks Next.js default scroll restoration)
    document.documentElement.style.scrollBehavior = "auto";
    
    // Force instant scroll to top
    window.scrollTo(0, 0);
    
    // Restore the CSS smooth scroll behavior immediately after
    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = "";
    }, 10);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
