"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getReviewInvitation,
  submitReviewInvitation,
  ReviewInvitationData,
} from "@/services/reviewsService";
import { getFullImageUrl } from "@/lib/api";
import styles from "./ReviewModal.module.scss";

interface ReviewModalProps {
  token: string;
  onClose: () => void;
}

export default function ReviewModal({ token, onClose }: ReviewModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<ReviewInvitationData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form State
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Load invitation details
  useEffect(() => {
    let isCancelled = false;
    async function loadInvitation() {
      try {
        setLoading(true);
        setFetchError(null);

        if (token === "demo" || token === "test") {
          setInvitation({
            target_type: "trip",
            booking_id: "BK-DEMO-001",
            title: "Luxor & Aswan Nile Cruise Experience",
            slug: "luxor-aswan-nile-cruise-experience",
            image_url: "/images/desert/safari.jpg",
            start_date: "2026-09-10",
            end_date: "2026-09-15",
            details: { adults: 2, children: 0 },
            customer_name: "Demo Traveler",
            is_submitted: false,
            submitted_at: null,
          });
          setLoading(false);
          return;
        }

        const data = await getReviewInvitation(token);
        if (!isCancelled) {
          setInvitation(data);
          if (data.is_submitted) {
            setIsSuccess(true);
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          const msg =
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "This review link is invalid or has expired.";
          setFetchError(msg);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    if (token) {
      loadInvitation();
    }
    return () => {
      isCancelled = true;
    };
  }, [token]);

  // Handle Photo selection
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 5 - photos.length;
    if (availableSlots <= 0) {
      setPhotoError("Maximum 5 photos allowed.");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const newPhotos: string[] = [];

    for (const file of filesToProcess) {
      if (!file.type.startsWith("image/")) {
        setPhotoError("Please select only valid image files (JPEG, PNG, WEBP).");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setPhotoError(`Photo "${file.name}" exceeds the 10MB limit.`);
        continue;
      }

      try {
        const base64 = await readFileAsBase64(file);
        newPhotos.push(base64);
      } catch {
        setPhotoError("Failed to read image file.");
      }
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Submit Review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (token === "demo" || token === "test") {
        setTimeout(() => {
          setIsSubmitting(false);
          setIsSuccess(true);
        }, 600);
        return;
      }

      await submitReviewInvitation(token, {
        title: title.trim(),
        body: body.trim(),
        rating,
        photos: photos.length > 0 ? photos : undefined,
      });

      setIsSuccess(true);
    } catch (err: any) {
      const errDetail =
        err?.response?.data?.token ||
        err?.response?.data?.body?.[0] ||
        err?.response?.data?.title?.[0] ||
        err?.response?.data?.rating?.[0] ||
        err?.response?.data?.photos?.[0] ||
        err?.response?.data?.detail ||
        "Failed to submit review. Please try again.";
      setSubmitError(typeof errDetail === "string" ? errDetail : JSON.stringify(errDetail));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExploreMore = () => {
    onClose();
    router.push("/egypttours");
  };

  const isValid = rating > 0 && title.trim().length > 0 && body.trim().length >= 50;

  if (!mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      {isSuccess ? (
        <div
          className={styles.successDialog}
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.successInner}>
            <div className={styles.successContent}>
              <div className={styles.successIconBadge} aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className={styles.successTextBlock}>
                <h2 className={styles.successTitle}>Thanks for sharing your experience!</h2>
                <p className={styles.successSubtitle}>
                  Your feedback helps us improve and guide other travelers
                </p>
              </div>
            </div>
            <button
              type="button"
              className={styles.exploreButton}
              onClick={handleExploreMore}
            >
              Explore More Trips
            </button>
          </div>
        </div>
      ) : (
        <div
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerInfo}>
              <h2 id="review-modal-title" className={styles.headerTitle}>
                Write Your Review
              </h2>
              <p className={styles.headerSubtitle}>
                Share your experience to help other travelers plan their perfect trip.
              </p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close dialog"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          {/* Modal Content */}
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner} />
              <p className={styles.uploadPrimaryText}>Loading your booking details...</p>
            </div>
          ) : fetchError ? (
            <div className={styles.errorContainer}>
              <div className={styles.errorIconBadge} aria-hidden>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className={styles.errorTitle}>Review Link Unavailable</h3>
              <p className={styles.errorSubtitle}>{fetchError}</p>
              <button
                type="button"
                className={styles.errorButton}
                onClick={onClose}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.body}>
              {/* Target Banner */}
              <section className={styles.targetCard}>
                <h3 className={styles.targetTitle}>{invitation?.title || "Your Experience"}</h3>
                <div className={styles.targetImageWrapper}>
                  {invitation?.image_url && !imageLoadError ? (
                    <Image
                      src={getFullImageUrl(invitation.image_url)}
                      alt={invitation.title || "Experience"}
                      fill
                      sizes="(max-width: 768px) 100vw, 704px"
                      className={styles.targetImage}
                      priority
                      onError={() => setImageLoadError(true)}
                    />
                  ) : (
                    <div className={styles.placeholderBanner} />
                  )}
                </div>
              </section>

              {/* Rating Section */}
              <section className={styles.section}>
                <label className={styles.sectionLabel}>
                  How would you rate your experience? *
                </label>
                <div className={styles.starsRow} role="radiogroup" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        className={styles.starButton}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Image
                          src={isFilled ? "/images/review/star-filled.svg" : "/images/review/star.svg"}
                          alt=""
                          width={36}
                          height={34}
                        />
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Review Title */}
              <section className={styles.section}>
                <label htmlFor="review-title" className={styles.fieldLabel}>
                  Review Title *
                </label>
                <input
                  id="review-title"
                  type="text"
                  className={styles.inputField}
                  placeholder="Summarize your experience in a few words"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </section>

              {/* Your Review */}
              <section className={styles.section}>
                <label htmlFor="review-body" className={styles.fieldLabel}>
                  Your Review *
                </label>
                <textarea
                  id="review-body"
                  className={styles.textareaField}
                  placeholder="Tell us about your experience with this trip. What did you enjoy most? Any tips for future travelers?"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  required
                />
                <p className={`${styles.charCounter} ${body.length > 0 && body.length < 50 ? styles.charCounterInvalid : ""}`}>
                  Minimum 50 characters ({body.length}/50)
                </p>
              </section>

              {/* Add Photos (Optional) */}
              <section className={styles.section}>
                <label className={styles.fieldLabel}>Add Photos (Optional)</label>
                <div className={styles.photosContainer}>
                  {photos.map((photo, index) => (
                    <div key={index} className={styles.photoThumbnail}>
                      <Image
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 226px"
                        className={styles.thumbImg}
                      />
                      <button
                        type="button"
                        className={styles.deletePhotoBtn}
                        onClick={() => handleRemovePhoto(index)}
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {photos.length < 5 && (
                    <div
                      className={`${styles.uploadBox} ${photos.length === 0 ? styles.uploadBoxFull : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      <div className={styles.cameraIcon}>
                        <Image src="/images/review/camera.svg" alt="" width={40} height={40} />
                      </div>
                      <p className={styles.uploadPrimaryText}>Click to upload photos from your trip</p>
                      <p className={styles.uploadSecondaryText}>Maximum 5 photos, up to 10MB each</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        className={styles.fileInput}
                        onChange={handlePhotoUpload}
                      />
                    </div>
                  )}
                </div>
                {photoError && <p className={styles.errorMessage}>{photoError}</p>}
              </section>

              {submitError && <p className={styles.errorMessage}>{submitError}</p>}

              {/* Actions Row */}
              <div className={styles.actionsRow}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>,
    document.body
  );
}
