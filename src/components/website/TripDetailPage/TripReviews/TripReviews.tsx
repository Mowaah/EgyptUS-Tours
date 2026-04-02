import { TestimonialCard, Button } from "@/components/shared";
import type { Testimonial } from "@/components/shared/TestimonialCard/TestimonialCard";
import Image from "next/image";
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
