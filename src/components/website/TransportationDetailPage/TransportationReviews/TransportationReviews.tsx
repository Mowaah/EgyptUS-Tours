import React from 'react';
import Image from 'next/image';
import { ReviewGrid } from '@/components/shared';
import styles from './TransportationReviews.module.scss';

const REVIEWS = [
  { id: 1, author: 'Sarah Jenkins', date: 'January 10, 2025', text: 'An absolute pleasure to travel in such comfort. The driver was professional and the car was immaculate.', rating: 5, avatar: '/images/users/user1.jpg' },
  { id: 2, author: 'Anna & Marco', date: 'January 28, 2025', text: 'Punctual, clean, and incredibly smooth ride. Our driver greeted us with a smile and made us feel right at home.', rating: 5, avatar: '/images/users/user2.jpg' },
  { id: 3, author: 'Michael Thompson', date: 'January 07, 2025', text: 'Booked a private transfer from Cairo airport to the hotel. Flawless experience â€” driver was waiting, luggage handled with care.', rating: 5, avatar: '/images/users/user3.jpg' },
  { id: 4, author: 'Isabella Thompson', date: 'November 18, 2024', text: 'From check-in to check-out, the transportation logistics were seamless. Highly recommend for group travel.', rating: 5, avatar: null },
  { id: 5, author: 'Robert Jackson', date: 'October 17, 2024', text: 'The vehicle was spotless, air-conditioned, and the driver was knowledgeable about the city. Perfect service.', rating: 4.5, avatar: null },
  { id: 6, author: 'William Hernandez', date: 'December 23, 2024', text: 'Excellent value for money. Our group of 8 was transported comfortably with no delays whatsoever.', rating: 5, avatar: null },
  { id: 7, author: 'Layla Hassan', date: 'February 14, 2025', text: 'We used the private transfer for our honeymoon and it exceeded expectations. Elegant car, kind driver.', rating: 5, avatar: null },
  { id: 8, author: 'James & Emily Carter', date: 'March 2, 2025', text: 'Reliable, affordable, and stress-free. The driver showed up 10 minutes early and helped us every step of the way.', rating: 5, avatar: null },
  { id: 9, author: 'Fatima Al-Rashid', date: 'March 19, 2025', text: 'Booked for an airport pickup at 3am â€” driver was on time, patient, and professional. Truly impressive.', rating: 4.5, avatar: null },
  { id: 10, author: 'David Okafor', date: 'April 5, 2025', text: 'Clean minivan for a family of 6. The kids loved it and we had plenty of space for luggage. Will book again.', rating: 5, avatar: null },
  { id: 11, author: 'Nina Petrov', date: 'April 21, 2025', text: 'The transfer from Luxor to Aswan was smooth and scenic. Driver was friendly and recommended great stops along the way.', rating: 5, avatar: null },
  { id: 12, author: 'Carlos Mendez', date: 'May 3, 2025', text: 'Great communication before the trip, arrived on time, and made sure we reached our destination safely. Highly recommended!', rating: 5, avatar: null },
];

export default function TransportationReviews() {
  return (
    <section id="reviews" className={styles.section}>
      <h2 className={styles.title}>Travelers' Reviews</h2>
      <ReviewGrid 
        items={REVIEWS} 
        pageSize={6} 
        renderItem={(review) => (
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
        )} 
      />
    </section>
  );
}
