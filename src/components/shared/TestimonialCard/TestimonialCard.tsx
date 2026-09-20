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
  location?: string;
  countryCode?: string;
  rating: number;
  title?: string;
  date?: string;
  avatar?: string;
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
  } catch {
    return url;
  }
};

function formatReviewDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TestimonialCard({ testimonial }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  const hasVideo = Boolean(testimonial.videoUrl && testimonial.videoUrl.trim() !== "");

  // ── If No Video: Render Traveler Reviews Design (matching transportation) ──
  if (!hasVideo) {
    const cleanQuote = testimonial.quote
      ? testimonial.quote.replace(/^["“”]/, "").replace(/["“”]$/, "")
      : "";
    const displayTitle = testimonial.title || "Traveler Review";
    const dateStr = formatReviewDate(testimonial.date);
    const avatarSrc = testimonial.avatar || testimonial.image;

    return (
      <div className={styles.reviewCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.authorTitle}>{displayTitle}</h3>
          <div className={styles.ratingBox}>
            <Image src="/images/star-yellow3.svg" alt="" width={12} height={12} />
            <span>{testimonial.rating || 5}</span>
          </div>
        </div>

        <p className={styles.reviewContent}>{cleanQuote}</p>

        <div className={styles.cardFooter}>
          <div className={styles.reviewerInfo}>
            <div className={styles.avatar}>
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={testimonial.name}
                  width={36}
                  height={36}
                  className={styles.avatarImg}
                />
              ) : (
                <div className={styles.avatarPlaceholder} />
              )}
            </div>

            <div className={styles.reviewerText}>
              <p className={styles.reviewAuthorName}>{testimonial.name}</p>
              {dateStr && <p className={styles.reviewDate}>{dateStr}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── If Has Video: Render Video Testimonial Card ──
  const ytId = testimonial.videoUrl!.includes("youtube.com/watch")
    ? new URL(testimonial.videoUrl!).searchParams.get("v")
    : testimonial.videoUrl!.includes("youtu.be/")
      ? testimonial.videoUrl!.split("youtu.be/")[1]?.split("?")[0]
      : null;
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
          ) : !isEmbed ? (
            <video
              src={testimonial.videoUrl}
              className={styles.videoPlayer}
              preload="metadata"
            />
          ) : (
            <div className={styles.thumbPlaceholder} />
          )}

          {isPlaying && (
            isEmbed ? (
              <iframe
                src={getEmbedUrl(testimonial.videoUrl!)}
                className={styles.videoEmbed}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={testimonial.videoUrl}
                className={styles.videoActive}
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

        {!isPlaying && (
          <button
            className={styles.playBtn}
            aria-label="Play video"
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
              {(testimonial.countryCode || testimonial.location) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://hatscripts.github.io/circle-flags/flags/${(testimonial.countryCode || testimonial.location)!.toLowerCase()}.svg`}
                  alt={testimonial.location || ""}
                  width={18}
                  height={18}
                  className={styles.flagImg}
                />
              )}
              {testimonial.location && <span className={styles.reviewerLocation}>{testimonial.location}</span>}
            </div>
            <StarRating value={testimonial.rating} />
          </div>
        </div>
      </div>
    </div>
  );
}
