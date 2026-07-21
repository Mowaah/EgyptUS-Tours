"use client";

import { TestimonialCard, ReviewGrid } from "@/components/shared";
import type { Testimonial } from "@/components/shared/TestimonialCard/TestimonialCard";
import styles from "./TripReviews.module.scss";

// Reusing same mock data from home page repeated to fill 2 rows
const BASE_REVIEWS: Testimonial[] = [
  {
    image: "/images/testimonials/marcus.jpg",
    quote: '"Best trip of my life! The Nile cruise was luxurious and the whole experience was seamlessly organized."',
    name: "Marcus Chen",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/sarah.jpg",
    quote: '"The pyramids tour was absolutely breathtaking! Our guide was incredibly knowledgeable and made history come alive."',
    name: "Sarah Johnson",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/emma.jpg",
    quote: '"Our honeymoon in Egypt was magical! The private tour was perfectly tailored to our interests."',
    name: "Emma & James",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/marcus.jpg",
    quote: '"Best trip of my life! The Nile cruise was luxurious and the whole experience was seamlessly organized."',
    name: "Marcus Chen",
    location: "Singapore",
    rating: 4.2,
  },
];

const REVIEWS = [...BASE_REVIEWS, ...BASE_REVIEWS, ...BASE_REVIEWS];

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
