"use client";

import { useState } from "react";
import Image from "next/image";
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

  if (!images || images.length === 0) return null;

  return (
    <div className={styles.gallery}>
      {/* Main image */}
      <div className={styles.main}>
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={`${styles.imageSlide} ${activeIndex === i ? styles.imageSlideActive : ""}`}
            aria-hidden={activeIndex !== i}
          >
            <Image
              src={src}
              alt={`${title} - Photo ${i + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 75vw"
              className={styles.mainImg}
              priority={i <= 1}
              loading={i <= 2 ? "eager" : "lazy"}
            />
          </div>
        ))}

        <div className={styles.counter}>
          {activeIndex + 1}/{images.length}
        </div>
        {images.length > 1 && (
          <>
            <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous">
              <Image src="/images/arrows/pagination-arrow.svg" alt="Previous" width={16} height={16} />
            </button>
            <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next">
              <Image src="/images/arrows/pagination-arrow.svg" alt="Next" width={16} height={16} />
            </button>
          </>
        )}
        
        {/* Render provided overlay OR the built-in mobile overlay */}
        {overlayContent || (
          <div className={styles.mobileOverlay}>
            <div className={styles.overlayGradient} />
            <div className={styles.overlayContent}>
              <h1 className={styles.mobileTitle}>{title}</h1>
              {description && <p className={styles.mobileDesc}>{description}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {thumbs.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.thumb} ${activeIndex === i ? styles.thumbActive : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`View photo ${i + 1}`}
            >
              <Image src={src} alt={`${title} Photo ${i + 1}`} fill sizes="120px" className={styles.thumbImg} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
