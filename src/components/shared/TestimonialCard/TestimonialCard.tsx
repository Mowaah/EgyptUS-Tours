"use client";

import Image from "next/image";
import { useState } from "react";
import StarRating from "../StarRating/StarRating";
import styles from "./TestimonialCard.module.scss";

export interface Testimonial {
  image?: string;
  videoUrl?: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
}

interface Props {
  testimonial: Testimonial;
}

const getEmbedUrl = (url: string) => {
  try {
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URL(url).searchParams;
      return `https://www.youtube.com/embed/${urlParams.get("v")}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  } catch (e) {
    return url;
  }
};

export default function TestimonialCard({ testimonial }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  const hasVideo = Boolean(testimonial.videoUrl);
  const ytId = hasVideo ? (
    testimonial.videoUrl!.includes("youtube.com/watch") 
      ? new URL(testimonial.videoUrl!).searchParams.get("v") 
      : testimonial.videoUrl!.includes("youtu.be/") 
        ? testimonial.videoUrl!.split("youtu.be/")[1]?.split("?")[0] 
        : null
  ) : null;
  const isEmbed = Boolean(ytId);

  // Use YouTube thumbnail if it's YouTube, otherwise fallback to the provided image or nothing
  const thumbnailSrc = ytId 
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` 
    : testimonial.image;

  return (
    <div className={styles.card}>
      <div className={styles.videoWrapper}>
        <div className={styles.videoThumb}>
          {thumbnailSrc ? (
            <Image
              src={thumbnailSrc}
              alt={testimonial.name}
              fill
              sizes="(max-width: 768px) 100vw, 280px"
              className={styles.thumbImg}
            />
          ) : hasVideo && !isEmbed ? (
            <video
              src={testimonial.videoUrl}
              className={styles.thumbImg}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              preload="metadata"
            />
          ) : (
            <div className={styles.thumbImg} style={{ background: "#000", width: "100%", height: "100%" }} />
          )}

          {isPlaying && hasVideo && (
            isEmbed ? (
              <iframe
                src={getEmbedUrl(testimonial.videoUrl!)}
                className={styles.thumbImg}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", zIndex: 1 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={testimonial.videoUrl}
                className={styles.thumbImg}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
                controls
                autoPlay
              />
            )
          )}

          {!isPlaying && <div className={styles.overlay} />}
        </div>

        <div className={styles.quoteIcon}>
          <Image src="/images/quotation.svg" alt="" width={29} height={17} />
        </div>

        {hasVideo && !isPlaying && (
          <button 
            className={styles.playBtn} 
            aria-label="Play video" 
            style={{ backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)", zIndex: 2 }}
            onClick={() => setIsPlaying(true)}
          >
            <Image src="/images/playbtn.svg" alt="" width={20} height={20} />
          </button>
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.quote}>{testimonial.quote}</p>
        <div className={styles.reviewer}>
          <span className={styles.reviewerName}>{testimonial.name}</span>
          <div className={styles.reviewerMeta}>
            <div className={styles.locationWrap}>
              <Image src="/images/en.svg" alt="flag" width={18} height={12} />
              <span className={styles.reviewerLocation}>{testimonial.location}</span>
            </div>
            <StarRating value={testimonial.rating} />
          </div>
        </div>
      </div>
    </div>
  );
}
