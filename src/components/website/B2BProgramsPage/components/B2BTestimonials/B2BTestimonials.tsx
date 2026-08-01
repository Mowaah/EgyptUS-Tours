"use client";

import { TestimonialCard, ReviewGrid } from '@/components/shared';
import type { Testimonial } from '@/components/shared/TestimonialCard/TestimonialCard';
import { COUNTRIES } from '@/data/countries';
import styles from './B2BTestimonials.module.scss';

import type { TestimonialData } from "@/services/testimonialsService";

interface B2BTestimonialsProps {
  testimonials?: TestimonialData[];
}

const PAGE_SIZE = 8;

export default function B2BTestimonials({ testimonials = [] }: B2BTestimonialsProps) {
  if (testimonials.length === 0) {
    return null; // Or return an empty state if preferred
  }

  const mappedTestimonials: Testimonial[] = testimonials.map(t => {
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
      <div className={styles.header}>
        <h2 className={styles.title}>What Our Corporate Partners Say</h2>
        <p className={styles.subtitle}>Hear from organizations that partnered with us for high-impact corporate.</p>
      </div>
      <ReviewGrid 
        items={mappedTestimonials} 
        pageSize={PAGE_SIZE} 
        gridClassName={styles.grid}
        renderItem={(t, i) => <TestimonialCard key={i} testimonial={t} />} 
      />
    </section>
  );
}
