"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/**
 * Drop this once inside the root layout (layout.tsx).
 * It mounts the global IntersectionObserver that powers the scroll-reveal
 * system across the entire site — no per-component changes required.
 */
export default function ScrollAnimationProvider() {
  useScrollAnimation();
  return null; // renders nothing
}
