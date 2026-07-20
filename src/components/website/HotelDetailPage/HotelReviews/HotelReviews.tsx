import Image from "next/image";
import { Hotel, HotelReview } from "@/types";
import { Button } from "@/components/shared";
import styles from "./HotelReviews.module.scss";

interface HotelReviewsProps {
  hotel: Hotel;
}

export default function HotelReviews({ hotel }: HotelReviewsProps) {
  const reviews = (hotel.hotelReviews || []).slice(0, 6);
  
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className={styles.section}>
      <h2 className={styles.heading}>Traveler Reviews</h2>

      <div className={styles.grid}>
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>

      <div className={styles.loadMoreWrap}>
        <Button
          variant="outline"
          icon={
            <Image
              src="/images/arrows/arrow-right-blue.svg"
              alt=""
              width={20}
              height={20}
              style={{ transform: "rotate(90deg)" }}
            />
          }
        >
          Load More
        </Button>
      </div>
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
