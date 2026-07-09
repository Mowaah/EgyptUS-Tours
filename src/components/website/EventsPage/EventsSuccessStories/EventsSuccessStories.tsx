"use client";

import { TestimonialCard, ReviewGrid } from '@/components/shared';
import type { Testimonial } from '@/components/shared/TestimonialCard/TestimonialCard';
import styles from './EventsSuccessStories.module.scss';

const STORIES: Testimonial[] = [
  {
    name: "Regional Finance Forum",
    location: "22 Countries",
    quote: '"Exceptional venue, seamless logistics, and competitive pricing made this our best event yet."',
    image: "/images/event-story1.jpg",
    rating: 5,
  },
  {
    name: "Global Pharmaceutical Convention",
    location: "30 Countries",
    quote: '"Professional execution, world-class venues, and unforgettable cultural experiences for our delegates."',
    image: "/images/event-story2.jpg",
    rating: 5,
  },
  {
    name: "International Technology Summit",
    location: "45 Countries",
    quote: '"The team delivered a flawless experience. Egypt exceeded our expectations as a MICE destination."',
    image: "/images/event-story3.jpg",
    rating: 5,
  },
  {
    name: "Global Sustainability Conference",
    location: "15 Countries",
    quote: '"A breathtaking setting that inspired our delegates. Flawless execution from start to finish."',
    image: "/images/event-story1.jpg",
    rating: 5,
  },
];

const PAGE_SIZE = 6;

export default function EventsSuccessStories() {
  return (
    <section className={styles.section}>
      <div className={styles.topBadge}>
        <span>97% Satisfaction Rate</span>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>Past Event Success Stories</h2>
        <p className={styles.subtitle}>Proven track record with international organizations</p>
      </div>

      <ReviewGrid 
        items={STORIES} 
        pageSize={PAGE_SIZE} 
        gridClassName={styles.grid}
        renderItem={(t, i) => <TestimonialCard key={i} testimonial={t} />} 
      />
    </section>
  );
}
