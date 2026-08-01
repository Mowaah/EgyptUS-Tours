"use client";

import Image from 'next/image';
import { ReviewGrid } from '@/components/shared';
import styles from './TransportationReviews.module.scss';
import { VehicleReview } from '@/types/api';

interface TransportationReviewsProps {
  reviews: VehicleReview[];
}

export default function TransportationReviews({ reviews }: TransportationReviewsProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section id="reviews" className={styles.section}>
      <h2 className={styles.title}>Travelers' Reviews</h2>
      <ReviewGrid 
        items={reviews} 
        pageSize={6} 
        gridClassName={styles.grid}
        renderItem={(review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.authorTitle}>{review.title}</h3>
              <div className={styles.ratingBox}>
                <Image src="/images/star-yellow3.svg" alt="" width={12} height={12} />
                <span>{parseFloat(review.rating) || 5}</span>
              </div>
            </div>
            <p className={styles.reviewContent}>{review.body}</p>
            <div className={styles.cardFooter}>
              <div className={styles.reviewerInfo}>
                <div className={styles.avatar}>
                  <div className={styles.avatarPlaceholder} />
                </div>
                <div className={styles.reviewerText}>
                  <p className={styles.reviewerName}>{review.author_name}</p>
                  <p className={styles.reviewDate}>{new Date(review.review_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        )} 
      />
    </section>
  );
}
