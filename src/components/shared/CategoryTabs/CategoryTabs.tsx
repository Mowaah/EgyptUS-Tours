"use client";

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import styles from "./CategoryTabs.module.scss";

interface CategoryTabsProps {
  tabs: string[];
  defaultActive?: number;
  active?: number;
  onTabChange?: (tab: string, index: number) => void;
  /**
   * When true, uses measured multi-row layout on viewports `≥ 1024px` only.
   * Below that, tabs stay on one line and scroll horizontally.
   */
  wrap?: boolean;
  className?: string;
}

export default function CategoryTabs({
  tabs,
  defaultActive = 0,
  active,
  onTabChange,
  wrap = false,
  className = "",
}: CategoryTabsProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActive);
  const activeIndex = active !== undefined ? active : internalActiveIndex;
  const [measuredRows, setMeasuredRows] = useState<string[][]>([]);
  const [isWide, setIsWide] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  // Sliding pill indicator
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    ready: boolean;
  }>({ left: 0, top: 0, width: 0, height: 0, ready: false });

  // Controls whether the indicator uses CSS transitions.
  // Starts false so the first measurement snaps instantly,
  // then turns true so tab switches animate smoothly.
  const [animate, setAnimate] = useState(false);
  const rafId = useRef(0);
  // Keep a stable ref to the latest updateIndicator so layout-snap effects
  // don't need it in their dep array (which would re-fire on every tab switch).
  const updateIndicatorRef = useRef<() => void>(() => {});

  /** Multi-row "wrap" layout is desktop-only; phones/tablets use horizontal scroll */
  const useWrapLayout = wrap && isWide;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const updateIndicator = useCallback(() => {
    const activeEl = tabButtonRefs.current[activeIndex];
    const container = tabsContainerRef.current;
    if (!activeEl || !container) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    const left = activeRect.left - containerRect.left + container.scrollLeft;
    const top = activeRect.top - containerRect.top + container.scrollTop;
    setIndicator({
      left,
      top,
      width: activeRect.width,
      height: activeRect.height,
      ready: true,
    });
  }, [activeIndex]);

  // Always keep the ref in sync
  updateIndicatorRef.current = updateIndicator;

  // Snap instantly on mount and when layout rows change (no animation).
  // Does NOT depend on updateIndicator so tab switches don't trigger this.
  useLayoutEffect(() => {
    setAnimate(false);
    updateIndicatorRef.current();
    // After the browser paints the snapped position, re-enable transitions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimate(true);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measuredRows]);

  // Animate the indicator to the new tab position on tab switch.
  // This effect fires when activeIndex changes (via updateIndicator dep).
  // `animate` is already true by this point, so the CSS transition plays.
  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  // Recalculate after fonts finish loading (can shift button sizes)
  useEffect(() => {
    document.fonts.ready.then(() => updateIndicatorRef.current());
  }, []);

  // Recalculate indicator on window resize (covers responsive shifts)
  useEffect(() => {
    const handleResize = () => {
      setAnimate(false);
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        updateIndicatorRef.current();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimate(true);
          });
        });
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleClick = (tab: string, index: number) => {
    if (active === undefined) {
      setInternalActiveIndex(index);
    }
    onTabChange?.(tab, index);
  };

  const measureTabs = useCallback(() => {
    if (!useWrapLayout || !measureRef.current) return;
    const container = measureRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    const rows: string[][] = [];
    let currentY = -1;
    let currentRow: string[] = [];

    children.forEach((child, i) => {
      const top = child.offsetTop;
      if (currentY === -1 || top > currentY + 10) {
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [tabs[i]];
        currentY = top;
      } else {
        currentRow.push(tabs[i]);
      }
    });

    if (currentRow.length > 0) rows.push(currentRow);
    setMeasuredRows(rows);
  }, [tabs, useWrapLayout]);

  useLayoutEffect(() => {
    if (!useWrapLayout) {
      setMeasuredRows([]);
      return;
    }
    measureTabs();
  }, [measureTabs, useWrapLayout]);

  // Re-measure on window resize to ensure fluid wrapping exactly like CSS
  useEffect(() => {
    if (!useWrapLayout) return;
    const handleResize = () => measureTabs();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measureTabs, useWrapLayout]);

  /** Shared inline style for the indicator pill */
  const indicatorStyle: React.CSSProperties = {
    left: indicator.left,
    top: indicator.top,
    width: indicator.width,
    height: indicator.height,
    ...(animate ? {} : { transition: "none" }),
  };

  /** Data attribute to tell CSS the indicator is positioned */
  const readyAttr = indicator.ready ? { "data-indicator-ready": "" } : {};

  if (useWrapLayout) {
    if (measuredRows.length === 0) {
      // Pass 1: Invisible flex-wrap render to legally calculate browser wrapping
      return (
        <div
          className={`${styles.wrapEnabled} ${className}`}
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          <div className={styles.tabsWrapped} ref={measureRef}>
            {tabs.map((tab, index) => (
              <button key={`measure-${index}`} className={styles.tab}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Pass 2: Accurately render chunked rows with the desired distinct pill backgrounds
    let runningIndex = 0;
    return (
      <div
        className={`${styles.wrapRows} ${className}`}
        ref={tabsContainerRef}
        {...readyAttr}
      >
        {/* Sliding indicator pill — floats freely across rows */}
        {indicator.ready && (
          <span
            className={styles.indicator}
            style={indicatorStyle}
            aria-hidden
          />
        )}
        {measuredRows.map((row, rowIdx) => {
          const rowStart = runningIndex;
          runningIndex += row.length;
          return (
            <div key={rowIdx} className={styles.wrapper}>
              <div className={styles.tabs}>
                {row.map((tab, i) => {
                  const absIdx = rowStart + i;
                  return (
                    <button
                      key={`${tab}-${absIdx}`}
                      ref={(el) => {
                        tabButtonRefs.current[absIdx] = el;
                      }}
                      className={`${styles.tab} ${absIdx === activeIndex ? styles.active : ""}`}
                      onClick={() => handleClick(tab, absIdx)}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default: single scrollable pill row
  return (
    <div className={`${styles.wrapper} ${className}`} {...readyAttr}>
      <div className={styles.tabs} ref={tabsContainerRef}>
        {/* Sliding indicator pill — snaps on mount, animates on switch */}
        {indicator.ready && (
          <span
            className={styles.indicator}
            style={indicatorStyle}
            aria-hidden
          />
        )}
        {tabs.map((tab, index) => (
          <button
            key={`${tab}-${index}`}
            ref={(el) => {
              tabButtonRefs.current[index] = el;
            }}
            className={`${styles.tab} ${index === activeIndex ? styles.active : ""}`}
            onClick={() => handleClick(tab, index)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
