"use client";

import { TestimonialCard, ReviewGrid } from '@/components/shared';
import type { Testimonial } from '@/components/shared/TestimonialCard/TestimonialCard';
import styles from './EventsSuccessStories.module.scss';

import type { BackendTestimonial } from "@/services/testimonialsService";

interface EventsSuccessStoriesProps {
  testimonials?: BackendTestimonial[];
}

const PAGE_SIZE = 6;

export default function EventsSuccessStories({ testimonials = [] }: EventsSuccessStoriesProps) {
  if (testimonials.length === 0) {
    return null;
  }

  const mappedStories: Testimonial[] = testimonials.map(t => ({
    name: t.customer_name,
    location: t.country || "Guest",
    rating: t.rating || 5,
    quote: `"${t.title}"\n\n${t.description}`,
    videoUrl: t.video_url || "", 
    image: "", // We rely on the video thumbnail internally
  }));

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
