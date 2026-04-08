"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Trip, TripHotel } from "@/types";
import styles from "./HotelModal.module.scss";
import { RatingBadge } from "@/components/shared";

interface HotelModalProps {
  hotel: TripHotel;
  onClose: () => void;
}

export default function HotelModal({ hotel, onClose }: HotelModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted) return null;

  const photos = hotel.photos?.length ? hotel.photos : [hotel.image];
  const displayPhotos = photos.slice(0, 6);
  const remainingPhotos = photos.length - 6;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hotel-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
          <Image src="/images/x-modal.svg" alt="" width={24} height={24} />
        </button>

        <div className={styles.hero}>
          <Image src={hotel.image} alt={hotel.name} fill sizes="100vw" className={styles.heroImage} priority />
          <div className={styles.heroGradient} />
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h2 id="hotel-modal-title" className={styles.hotelName}>
                {hotel.name}
              </h2>
              <p className={styles.hotelLocation}>
                <Image src="/images/location-orange.svg" alt="" width={16} height={16} />
                {hotel.location}
              </p>
            </div>
            <RatingBadge
              rating={hotel.rating}
              reviews={hotel.reviewCount}
              size="md"
            />
          </div>
        </div>

        <div className={styles.body}>
          <section className={`${styles.section} ${styles.photosSection}`}>
            <div className={styles.includedBadge}>
              ✓ Included In Your Package
            </div>
            <h3 className={styles.sectionTitle}>Hotel Photos</h3>
            <div className={styles.photoGrid}>
              {displayPhotos.map((photo: string, i: number) => {
                const isLast = i === 5 && remainingPhotos > 0;
                return (
                  <div key={i} className={styles.photoWrap}>
                    <Image src={photo} alt={`${hotel.name} photo ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 33vw" className={styles.photo} />
                    {isLast && (
                      <div className={styles.moreOverlay}>
                        +{remainingPhotos}
                        <span>More</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className={`${styles.section} ${styles.aboutSection}`}>
            <h3 className={styles.sectionTitle}>About This Hotel</h3>
            <p className={styles.description}>{hotel.description}</p>
          </section>

          <section className={`${styles.section} ${styles.amenitiesSection}`}>
            <h3 className={styles.sectionTitle}>Hotel Amenities & Services</h3>
            <div className={styles.amenityGrid}>
              {hotel.amenities.map((amenity: string, i: number) => (
                <div key={i} className={styles.amenityItem}>
                  <div className={styles.amenityIcon}>
                    <Image src="/images/check-blue.svg" alt="" width={16} height={16} />
                  </div>
                  {amenity}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
