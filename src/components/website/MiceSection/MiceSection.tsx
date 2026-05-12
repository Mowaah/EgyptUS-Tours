"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { SectionHeader, FeatureCard, Button, PaginationArrows } from "@/components/shared";
import Image from "next/image";
import styles from "./MiceSection.module.scss";

const FEATURES = [
  {
    title: "Meetings",
    description: "Executive boardrooms and strategic gatherings",
    color: "#2563EB",
    iconSrc: "/images/mice/meetings.svg",
  },
  {
    title: "Incentives",
    description: "Luxury reward trips and curated team experiences",
    color: "#EF4444",
    iconSrc: "/images/mice/incentives.svg",
  },
  {
    title: "Conferences",
    description: "Large-scale conferences with full technical support",
    color: "#10B981",
    iconSrc: "/images/mice/conferences.svg",
  },
  {
    title: "Exhibitions",
    description: "Professional exhibition spaces and event management",
    color: "#8B5CF6",
    iconSrc: "/images/mice/exhibitions.svg",
  },
];

const GALLERY_IMAGES = [
  "/images/corporate/corporate1.jpg",
  "/images/corporate/corporate2.jpg",
  "/images/corporate/corporate3.jpg",
  "/images/corporate/corporate4.jpg",
  "/images/corporate/corporate5.jpg",
];

const N = GALLERY_IMAGES.length; // always 5

// Original Figma fan positions — indexed 0 (far-left) → 4 (far-right).
// Center slot is index 2.
const SLOT_STYLES: React.CSSProperties[] = [
  { left: "0.11%",  top: "1.87%",  width: "21.40%", height: "78.27%", transform: "rotate(1.72deg)",  zIndex: 1 },
  { left: "15.45%", top: "13.60%", width: "21.66%", height: "78.12%", transform: "rotate(1.15deg)",  zIndex: 2 },
  { left: "38.39%", top: "12.07%", width: "23.85%", height: "87.43%", transform: "rotate(0deg)",     zIndex: 5 },
  { left: "63.25%", top: "13.96%", width: "21.06%", height: "78.13%", transform: "rotate(-1.15deg)", zIndex: 2 },
  { left: "78.38%", top: "0.15%",  width: "20.51%", height: "78.29%", transform: "rotate(-2.29deg)", zIndex: 1 },
];

export default function MiceSection() {
  const [active, setActive] = useState(0);

  const advance = useCallback(() => setActive((a) => (a + 1) % N), []);
  const retreat = useCallback(() => setActive((a) => (a - 1 + N) % N), []);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return; // ignore tiny taps
    if (dx < 0) retreat(); // swipe left → same as auto-rotation
    else advance();          // swipe right → reverse
  };

  // Auto-rotate every 3 s (right-to-left direction)
  useEffect(() => {
    const id = setInterval(retreat, 3000);
    return () => clearInterval(id);
  }, [retreat]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          label="MICE & Corporate Events"
          heading="Host World-Class Business Events in Egypt"
          description="High-level meetings, curated incentives, and world-class exhibitions tailored for leading organizations."
        />

        <div className={styles.features}>
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={
                <Image
                  src={feature.iconSrc}
                  alt=""
                  width={28}
                  height={28}
                />
              }
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>

        <div className={styles.gallery}>
          <PaginationArrows size={46} nextClassName={styles.arrowNext} onPrev={advance} onNext={retreat}>
            <div
              className={styles.galleryGrid}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {GALLERY_IMAGES.map((src, i) => {
                // Which fan slot does image i sit in?
                // Slot 2 = center; active image → slot 2
                const slot = (i - active + 2 + N) % N;
                const isCenter = slot === 2;

                return (
                  <div
                    key={i}
                    className={`${styles.galleryItem} ${isCenter ? styles.galleryItemActive : ""}`}
                    style={SLOT_STYLES[slot]}
                    onClick={() => setActive(i)}
                  >
                    <Image
                      src={src}
                      alt={`Corporate event ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className={styles.galleryImage}
                    />
                  </div>
                );
              })}
            </div>
          </PaginationArrows>
        </div>

        <div className={styles.viewAll}>
          <Button
            variant="outline"
            href="/mice"
            icon={
              <Image
                src="/images/arrows/arrow-right-blue.svg"
                alt=""
                width={16}
                height={16}
                style={{ marginTop: "2px" }}
              />
            }
          >
            View Details
          </Button>
        </div>
      </div>
    </section>
  );
}
