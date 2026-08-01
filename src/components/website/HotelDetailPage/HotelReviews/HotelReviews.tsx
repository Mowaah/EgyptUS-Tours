import Image from "next/image";
import { Hotel, HotelReview } from "@/types";
import { ReviewGrid } from "@/components/shared";
import styles from "./HotelReviews.module.scss";

interface HotelReviewsProps {
  hotel: Hotel;
}

export default function HotelReviews({ hotel }: HotelReviewsProps) {
  const reviews = hotel.hotelReviews || [];
  
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className={styles.section}>
      <h2 className={styles.heading}>Traveler Reviews</h2>

      <ReviewGrid
        items={reviews}
        pageSize={6}
        gridClassName={styles.grid}
        renderItem={(review, i) => (
          <ReviewCard key={i} review={review} />
        )}
      />
    </section>
  );
}

function ReviewCard({ review }: { review: HotelReview }) {
  return (
    <div className={styles.card}>
      {/* Top row: title + star */}
      <div className={styles.cardTop}>
        <h3 className={styles.cardTitle}>{review.title}</h3>
        <div className={styles.cardRating}>
          <Image src="/images/star-yellow3.svg" alt="star" width={14} height={14} />
          <span className={styles.ratingNum}>{review.rating}</span>
        </div>
      </div>

      {/* Body */}
      <p className={styles.cardBody}>{review.body}</p>

      {/* Author */}
      <div className={styles.cardAuthor}>
        <div className={styles.avatar} />
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{review.author}</span>
          <span className={styles.authorDate}>{review.date}</span>
        </div>
      </div>
    </div>
  );
}
