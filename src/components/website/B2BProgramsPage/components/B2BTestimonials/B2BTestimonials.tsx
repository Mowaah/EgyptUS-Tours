"use client";

import { TestimonialCard, ReviewGrid } from '@/components/shared';
import type { Testimonial } from '@/components/shared/TestimonialCard/TestimonialCard';
import { COUNTRIES } from '@/data/countries';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './B2BTestimonials.module.scss';

import type { TestimonialData } from "@/services/testimonialsService";

interface B2BTestimonialsProps {
  testimonials?: TestimonialData[];
}

const PAGE_SIZE = 8;

export default function B2BTestimonials({ testimonials = [] }: B2BTestimonialsProps) {
  const { t } = useTranslation("b2b");

  if (testimonials.length === 0) {
    return null;
  }

  const mappedTestimonials: Testimonial[] = testimonials.map(item => {
    const countryEntry = COUNTRIES.find(c => c.code.toUpperCase() === (item.country || '').toUpperCase());
    return {
      name: item.customer_name,
      location: countryEntry?.name || item.country || 'Guest',
      countryCode: (item.country || '').toLowerCase(),
      rating: item.rating || 5,
      quote: `"${item.description}"`,
      videoUrl: item.video_url || '',
      image: '',
    };
  });

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("testimonials.title", "What Our Corporate Partners Say")}</h2>
        <p className={styles.subtitle}>{t("testimonials.subtitle", "Hear from organizations that partnered with us for high-impact corporate.")}</p>
      </div>
      <ReviewGrid 
        items={mappedTestimonials} 
        pageSize={PAGE_SIZE} 
        gridClassName={styles.grid}
        renderItem={(item, i) => <TestimonialCard key={i} testimonial={item} />} 
      />
    </section>
  );
}
