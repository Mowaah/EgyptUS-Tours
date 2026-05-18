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
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const photos = hotel.photos?.length ? hotel.photos : [hotel.image];
  const displayPhotos = photos.slice(0, 6);
  const remainingPhotos = photos.length - 6;

  const handlePrev = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
  };

  const handleNext = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activePhotoIndex !== null) {
          setActivePhotoIndex(null);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowRight" && activePhotoIndex !== null) {
        handleNext();
      } else if (e.key === "ArrowLeft" && activePhotoIndex !== null) {
        handlePrev();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, activePhotoIndex, photos.length]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
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

          <div className={styles.hero} onClick={() => setActivePhotoIndex(0)} style={{ cursor: "pointer" }}>
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
                    <div key={i} className={styles.photoWrap} onClick={() => setActivePhotoIndex(i)}>
                      <Image 
                        src={photo} 
                        alt={`${hotel.name} photo ${i + 1}`} 
                        fill 
                        sizes="(max-width: 480px) 100vw, (max-width: 860px) 50vw, 300px" 
                        className={styles.photo} 
                      />
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
      </div>

      {activePhotoIndex !== null && (
        <div className={styles.lightbox} onClick={() => setActivePhotoIndex(null)}>
          <button 
            type="button" 
            className={styles.lightboxCloseBtn} 
            onClick={() => setActivePhotoIndex(null)}
            aria-label="Close photo viewer"
          >
            <Image src="/images/x-modal.svg" alt="" width={24} height={24} style={{ filter: "brightness(0) invert(1)" }} />
          </button>
          
          {photos.length > 1 && (
            <>
              <button 
                type="button" 
                className={`${styles.lightboxArrow} ${styles.left}`} 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                aria-label="Previous photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                type="button" 
                className={`${styles.lightboxArrow} ${styles.right}`} 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                aria-label="Next photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          <div className={styles.lightboxImageWrap} onClick={(e) => e.stopPropagation()}>
            <Image 
              src={photos[activePhotoIndex]} 
              alt={`${hotel.name} large photo ${activePhotoIndex + 1}`}
              fill
              sizes="90vw"
              className={styles.lightboxImage}
            />
            <div className={styles.lightboxCounter}>
              {activePhotoIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
