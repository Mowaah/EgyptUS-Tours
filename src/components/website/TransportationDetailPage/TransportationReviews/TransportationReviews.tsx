import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/shared';
import styles from './TransportationReviews.module.scss';

const REVIEWS = [
  { id: 1, author: 'Sarah Jenkins', date: 'January 10, 2025', text: 'An absolute pleasure to travel in such comfort. The driver was professional and the car was immaculate.', rating: 5, avatar: '/images/users/user1.jpg' },
  { id: 2, author: 'Anna & Marco', date: 'January 28, 2025', text: 'The location, comfort, and hospitality were outstanding. Waking up to the Nile view was simply magical.', rating: 5, avatar: '/images/users/user2.jpg' },
  { id: 3, author: 'Michael Thompson', date: 'January 07, 2025', text: 'Elegant rooms, attentive staff, and a peaceful ambiance made our stay absolutely memorable.', rating: 5, avatar: '/images/users/user3.jpg' },
  { id: 4, author: 'Isabella Thompson', date: 'November 18, 2024', text: 'From check-in to check-out, everything was seamless. The sunset views were breathtaking.', rating: 5, avatar: null },
  { id: 5, author: 'Robert Jackson', date: 'October 17, 2024', text: 'A perfect choice for couples. The atmosphere, views, and service made our trip unforgettable.', rating: 4.5, avatar: null },
  { id: 6, author: 'William Hernandez', date: 'December 23, 2024', text: 'Amazing location, beautiful design, and warm hospitality. Highly recommended for a relaxing stay in Cairo.', rating: 5, avatar: null },
];

export default function TransportationReviews() {
  return (
    <section id="reviews" className={styles.section}>
      <h2 className={styles.title}>Travelers' Reviews</h2>
      <div className={styles.grid}>
        {REVIEWS.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.authorTitle}>{review.text.length > 30 ? review.text.substring(0, 30) + '...' : review.text}</h3>
              <div className={styles.ratingBox}>
                <Image src="/images/star-yellow3.svg" alt="" width={12} height={12} />
                <span>{review.rating}</span>
              </div>
            </div>
            <p className={styles.reviewContent}>{review.text}</p>
            <div className={styles.cardFooter}>
              <div className={styles.reviewerInfo}>
                <div className={styles.avatar}>
                  {review.avatar ? (
                    <Image src={review.avatar} alt={review.author} width={32} height={32} />
                  ) : (
                    <div className={styles.avatarPlaceholder} />
                  )}
                </div>
                <div className={styles.reviewerText}>
                  <p className={styles.reviewerName}>{review.author}</p>
                  <p className={styles.reviewDate}>{review.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.loadMore}>
        <Button variant="outline" icon={<Image src="/images/arrows/arrow-down-blue.svg" alt="" width={16} height={16} />} iconPosition="right">
          Load More
        </Button>
      </div>
    </section>
  );
}
