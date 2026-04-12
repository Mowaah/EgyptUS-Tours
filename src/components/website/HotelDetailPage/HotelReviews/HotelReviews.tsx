import { TestimonialCard, Button } from "@/components/shared";
import type { Testimonial } from "@/components/shared/TestimonialCard/TestimonialCard";
import Image from "next/image";
import { Hotel } from "@/types";
import styles from "./HotelReviews.module.scss";

interface HotelReviewsProps {
  hotel: Hotel;
}

export default function HotelReviews({ hotel }: HotelReviewsProps) {
  // Convert hotelReviews to Testimonial format
  const reviews: Testimonial[] = (hotel.hotelReviews ?? []).map(r => ({
    name: r.author,
    quote: r.body,
    rating: r.rating,
    location: "Traveler", // Default location if not provided
    image: "/images/testimonials/avatar-placeholder.jpg" // Placeholder
  }));

  // Duplicate to show a grid
  const displayReviews = [...reviews, ...reviews, ...reviews].slice(0, 6);

  return (
    <section id="reviews" className={styles.section}>
      <h2 className={styles.heading}>Traveler Reviews</h2>

      <div className={styles.grid}>
        {displayReviews.map((review, i) => (
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
