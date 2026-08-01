"use client";

import { TestimonialCard, ReviewGrid } from '@/components/shared';
import type { Testimonial } from '@/components/shared/TestimonialCard/TestimonialCard';
import { COUNTRIES } from '@/data/countries';
import styles from './EventsSuccessStories.module.scss';

import type { TestimonialData } from "@/services/testimonialsService";

interface EventsSuccessStoriesProps {
  testimonials?: TestimonialData[];
}

const PAGE_SIZE = 6;

export default function EventsSuccessStories({ testimonials = [] }: EventsSuccessStoriesProps) {
  if (testimonials.length === 0) {
    return null;
  }

  const mappedStories: Testimonial[] = testimonials.map(t => {
    const countryEntry = COUNTRIES.find(c => c.code.toUpperCase() === (t.country || '').toUpperCase());
    return {
      name: t.customer_name,
      location: countryEntry?.name || t.country || 'Guest',
      countryCode: (t.country || '').toLowerCase(),
      rating: t.rating || 5,
      quote: `"${t.description}"`,
      videoUrl: t.video_url || '',
      image: '',
    };
  });

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
        items={mappedStories} 
        pageSize={PAGE_SIZE} 
        gridClassName={styles.grid}
        renderItem={(t, i) => <TestimonialCard key={i} testimonial={t} />} 
      />
    </section>
  );
}
