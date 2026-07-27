"use client";

import { TestimonialCard, ReviewGrid } from "@/components/shared";
import type { Testimonial } from "@/components/shared/TestimonialCard/TestimonialCard";
import styles from "./TripReviews.module.scss";

interface TripReviewsProps {
  reviews?: Testimonial[];
}

export default function TripReviews({ reviews = [] }: TripReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section id="traveler-reviews" className={styles.section}>
      <h2 className={styles.heading}>Traveler Reviews</h2>
      <ReviewGrid 
        items={reviews} 
        pageSize={8} 
        gridClassName={styles.grid}
        renderItem={(review, i) => <TestimonialCard key={i} testimonial={review} />} 
      />
    </section>
  );
}
