"use client";

import Image from "next/image";
import { Hotel, HotelReview } from "@/types";
import { Button } from "@/components/shared";
import styles from "./HotelReviews.module.scss";

interface HotelReviewsProps {
  hotel: Hotel;
}

const MOCK_REVIEWS: HotelReview[] = [
  { title: "Unforgettable Stay by the Nile", body: "A beautiful hotel with stunning views, exceptional service, and a truly relaxing atmosphere. Every moment felt special.", author: "Sarah Jenkins", date: "January 10, 2025", rating: 5 },
  { title: "Perfect Getaway in Egypt", body: "The location, comfort, and hospitality were outstanding. Waking up to the Nile view was simply magical.", author: "Anna & Marco", date: "January 28, 2025", rating: 5 },
  { title: "Luxury & Comfort Combined", body: "Elegant rooms, attentive staff, and a peaceful ambiance made our stay absolutely memorable.", author: "Michael Thompson", date: "January 07, 2025", rating: 5 },
  { title: "A Stay to Remember", body: "From check-in to check-out, everything was seamless. The sunset views were breathtaking.", author: "Isabella Thompson", date: "November 18, 2024", rating: 5 },
  { title: "Ideal for a Romantic Escape", body: "A perfect choice for couples. The atmosphere, views, and service made our trip unforgettable.", author: "Robert Jackson", date: "October 17, 2024", rating: 4.5 },
  { title: "Exceptional Experience", body: "Amazing location, beautiful design, and warm hospitality. Highly recommended for a relaxing stay in Cairo.", author: "William Hernandez", date: "December 23, 2024", rating: 5 },
];

export default function HotelReviews({ hotel }: HotelReviewsProps) {
  const reviews = (hotel.hotelReviews?.length ? hotel.hotelReviews : MOCK_REVIEWS).slice(0, 6);

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
  // Build an array of full/half stars
  const fullStars = Math.floor(review.rating);
  const hasHalf = review.rating % 1 >= 0.5;

  return (
    <div className={styles.card}>
      {/* Top row: title + star */}
      <div className={styles.cardTop}>
        <h3 className={styles.cardTitle}>{review.title}</h3>
        <div className={styles.cardRating}>
          <Image src="/images/star-yellow.svg" alt="star" width={14} height={14} />
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
