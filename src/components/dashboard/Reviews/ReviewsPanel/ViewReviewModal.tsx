import Image from "next/image";
import type { ReviewRow, AdminTestimonialRow } from "../types";
import StarRating from "@/components/shared/StarRating/StarRating";
import styles from "./ViewReviewModal.module.scss";
import panelStyles from "./ReviewsPanel.module.scss";

interface ViewReviewModalProps {
  open: boolean;
  onClose: () => void;
  onReply?: () => void;
  data: ReviewRow | AdminTestimonialRow | null;
  type: "user" | "admin";
}

const categoryClass: Record<string, string> = {
  Trips: panelStyles.categoryTrips,
  Transportation: panelStyles.categoryTransport,
  Hotels: panelStyles.categoryHotels,
  B2B: panelStyles.categoryB2B,
  Mice: panelStyles.categoryMice,
};

const statusClass: Record<string, string> = {
  Pending: panelStyles.statusPending,
  Replied: panelStyles.statusReplied,
};

export default function ViewReviewModal({ open, onClose, onReply, data, type }: ViewReviewModalProps) {
  if (!open || !data) return null;

  const isUser = type === "user";
  const userRow = data as ReviewRow;
  const adminRow = data as AdminTestimonialRow;

  const email = data.email || "No email provided";
  const body = data.body || "No description provided.";
  const title = isUser ? ((data as ReviewRow).title || "No Title") : data.customer;
  const photos = data.photos || [];
  const videoUrl = (data as any).videoUrl || null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="view-review-title">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.featuredIcon}>
              <Image src="/images/dashboard/reviews/modal/review.svg" alt="" width={20} height={20} />
            </div>
            <div className={styles.titleArea}>
              <div className={styles.titleRow}>
                <h2 id="view-review-title" className={styles.title}>{title}</h2>
                <span className={`${panelStyles.pill} ${panelStyles.categoryPill} ${categoryClass[data.category]}`}>
                  {data.category}
                </span>
                {isUser && (
                  <span className={`${panelStyles.pill} ${panelStyles.pillWithIcon} ${statusClass[userRow.status]}`}>
                    {userRow.status === "Pending" ? (
                      <span className={panelStyles.spinnerWrap} aria-hidden>
                        <svg className={panelStyles.spinnerSvg} width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                          <path fill="none" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                    ) : (
                      <Image src="/images/dashboard/active.svg" alt="" width={16} height={16} className={panelStyles.statusIcon} />
                    )}
                    {userRow.status}
                  </span>
                )}
              </div>
              <p className={styles.subtitle}>{data.id} · {data.date}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <Image src="/images/x-modal.svg" alt="" width={24} height={24} />
          </button>
        </div>

        <div className={styles.body}>
          {isUser ? (
            <>
              {/* Name Block */}
              <div className={styles.infoBlock}>
                <Image src="/images/dashboard/reviews/modal/name.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Title</p>
                  <p className={styles.infoValue}>{title}</p>
                </div>
              </div>

              {/* Customer Block */}
              <div className={styles.infoBlock}>
                <Image src="/images/dashboard/reviews/modal/customer.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Customer</p>
                  <p className={styles.infoValue}>{data.customer}</p>
                </div>
              </div>

              {/* Email Block */}
              <div className={styles.infoBlock}>
                <Image src="/images/dashboard/reviews/modal/email.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Email</p>
                  <p className={styles.infoValue}>{email}</p>
                </div>
              </div>

              {/* Review Block */}
              <div className={styles.reviewBlock}>
                <Image src="/images/dashboard/reviews/modal/review.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                <div className={styles.reviewContent}>
                  <div className={styles.reviewHeader}>
                    <p className={styles.infoLabel}>Review</p>
                    <StarRating filled={data.rating} showValue={false} size={18} />
                  </div>
                  <p className={styles.reviewText}>{body}</p>
                </div>
              </div>

              {/* Photos Block */}
              {photos && photos.length > 0 && (
                <div className={styles.photosBlock}>
                  <Image src="/images/dashboard/reviews/modal/photos.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                  <div className={styles.photosContent}>
                    <p className={styles.infoLabel}>Photos</p>
                    <div className={styles.photoGrid}>
                      {photos.map((photo, idx) => (
                        <div
                          key={idx}
                          className={styles.photoItem}
                          style={{
                            background: `linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${photo}') center/cover no-repeat`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Name Block */}
              <div className={styles.infoBlock}>
                <Image src="/images/dashboard/reviews/modal/name.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Title</p>
                  <p className={styles.infoValue}>{title}</p>
                </div>
              </div>

              {/* Customer Block */}
              <div className={styles.infoBlock}>
                <Image src="/images/dashboard/reviews/modal/customer.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Customer</p>
                  <p className={styles.infoValue}>{adminRow.customer}</p>
                </div>
              </div>

              {/* Email Block */}
              <div className={styles.infoBlock}>
                <Image src="/images/dashboard/reviews/modal/email.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Email</p>
                  <p className={styles.infoValue}>{email}</p>
                </div>
              </div>

              {/* Country Block */}
              <div className={styles.infoBlock}>
                <Image src="/images/dashboard/reviews/modal/country.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Country</p>
                  <div className={styles.flagRow}>
                    <img
                      src={`https://hatscripts.github.io/circle-flags/flags/${adminRow.countryCode}.svg`}
                      alt={adminRow.country}
                    />
                    <p className={styles.countryValue}>{adminRow.country}</p>
                  </div>
                </div>
              </div>

              {/* Rating & Testimonial Block */}
              <div className={styles.reviewBlock}>
                <Image src="/images/dashboard/reviews/modal/review.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                <div className={styles.reviewContent}>
                  <div className={styles.reviewHeader}>
                    <p className={styles.infoLabel}>Review</p>
                    <StarRating filled={adminRow.rating} showValue={false} size={18} />
                  </div>
                  <p className={styles.reviewText}>{body}</p>
                </div>
              </div>

              {/* Video Block */}
              <div className={styles.infoBlock}>
                <Image src="/images/dashboard/reviews/modal/video.svg" alt="" width={24} height={24} className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Video</p>
                  {videoUrl ? (
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer" className={styles.infoValue} style={{ textDecoration: "underline", wordBreak: "break-all" }}>{videoUrl}</a>
                  ) : adminRow.video ? (
                    <p className={styles.infoValue}>Video uploaded</p>
                  ) : (
                    <p className={styles.infoValue} style={{ color: "#9CA3AF" }}>No video</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {isUser && userRow.status !== "Replied" && (
          <div className={styles.actions}>
            <button className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.btnReply} onClick={() => {
              onClose();
              if (onReply) onReply();
            }}>
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

