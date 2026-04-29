"use client";

import { useState } from "react";
import Image from "next/image";
import GlassCard from "@/components/shared/GlassCard/GlassCard";
import styles from "./DetailGallery.module.scss";

interface DetailGalleryProps {
  images: string[];
  title: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  overlayContent?: React.ReactNode;
}

export default function DetailGallery({ images, title, rating, reviewCount, description, overlayContent }: DetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  const thumbs = images.slice(0, 5);

  return (
    <div className={styles.gallery}>
      {/* Main image */}
      <div className={styles.main}>
        <Image
          src={images[activeIndex]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 75vw"
          className={styles.mainImg}
          priority
        />
        <GlassCard className={styles.counter}>
          {activeIndex + 1} / {images.length}
        </GlassCard>
        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous">
          <Image src="/images/arrows/pagination-arrow.svg" alt="Previous" width={16} height={16} />
        </button>
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next">
          <Image src="/images/arrows/pagination-arrow.svg" alt="Next" width={16} height={16} style={{ transform: "rotate(180deg)" }} />
        </button>
        
        {/* Render provided overlay OR the built-in mobile overlay */}
        {overlayContent || (
          <div className={styles.mobileOverlay}>
            <div className={styles.overlayGradient} />
            <div className={styles.overlayContent}>
              <h1 className={styles.mobileTitle}>{title}</h1>
              {rating !== undefined && reviewCount !== undefined && (
                <div className={styles.mobileRating}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="#FFB02E">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{rating} ({reviewCount} reviews)</span>
                </div>
              )}
              {description && <p className={styles.mobileDesc}>{description}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className={styles.thumbs}>
        {thumbs.map((src, i) => (
          <button
            key={i}
            className={`${styles.thumb} ${activeIndex === i ? styles.thumbActive : ""}`}
            onClick={() => setActiveIndex(i)}
          >
            <Image src={src} alt={`${title} Photo ${i + 1}`} fill sizes="120px" className={styles.thumbImg} />
          </button>
        ))}
      </div>
    </div>
  );
}
