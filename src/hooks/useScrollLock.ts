import { useEffect } from "react";

/**
 * A custom hook to lock the background scroll when a modal or sidebar is open.
 * It locks both the body and the document element to ensure maximum compatibility
 * across mobile browsers while preventing the "jump to top" bug.
 */
export const useScrollLock = (lock: boolean) => {
  useEffect(() => {
    if (!lock) return;

    // Capture original styles
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;

    // Lock scroll
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      // Restore original styles
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [lock]);
};
