import { TestimonialCard } from "@/components/shared";
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

const REVIEWS = [...BASE_REVIEWS, ...BASE_REVIEWS];

export default function TripReviews() {
  return (
    <section id="traveler-reviews" className={styles.section}>
      <h2 className={styles.heading}>Traveler Reviews</h2>

      <div className={styles.grid}>
        {REVIEWS.map((review, i) => (
          <TestimonialCard key={i} testimonial={review} />
        ))}
      </div>

      <div className={styles.loadMoreWrap}>
        <button className={styles.loadMoreBtn}>
          Load More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
