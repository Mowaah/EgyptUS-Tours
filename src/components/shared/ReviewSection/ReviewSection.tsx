"use client";

import Image from "next/image";
import { Button } from "@/components/shared";
import styles from "./ReviewSection.module.scss";

export interface Review {
  title: string;
  body: string;
  author: string;
  date: string;
  rating: number;
  avatar?: string;
}

interface ReviewSectionProps {
  reviews: Review[];
  title?: string;
  id?: string;
}

export default function ReviewSection({ reviews, title = "Traveler Reviews", id = "reviews" }: ReviewSectionProps) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>

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
          iconPosition="right"
        >
          Load More
        </Button>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <h3 className={styles.cardTitle}>{review.title}</h3>
        <div className={styles.cardRating}>
          <Image src="/images/star-yellow.svg" alt="star" width={14} height={14} />
          <span className={styles.ratingNum}>{review.rating}</span>
        </div>
      </div>

      <p className={styles.cardBody}>{review.body}</p>

      <div className={styles.cardAuthor}>
        <div className={styles.avatar}>
          {review.avatar ? (
            <Image src={review.avatar} alt={review.author} width={36} height={36} />
          ) : (
            <div className={styles.avatarPlaceholder} />
          )}
        </div>
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{review.author}</span>
          <span className={styles.authorDate}>{review.date}</span>
        </div>
      </div>
    </div>
  );
}
