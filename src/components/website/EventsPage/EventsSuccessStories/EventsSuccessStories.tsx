"use client";

import { TestimonialCard, ReviewGrid } from '@/components/shared';
import type { Testimonial } from '@/components/shared/TestimonialCard/TestimonialCard';
import { COUNTRIES } from '@/data/countries';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './EventsSuccessStories.module.scss';

import type { TestimonialData } from "@/services/testimonialsService";

interface EventsSuccessStoriesProps {
  testimonials?: TestimonialData[];
}

const PAGE_SIZE = 6;

export default function EventsSuccessStories({ testimonials = [] }: EventsSuccessStoriesProps) {
  const { t } = useTranslation("events");

  if (testimonials.length === 0) {
    return null;
  }

  const mappedStories: Testimonial[] = testimonials.map(item => {
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
      <div className={styles.topBadge}>
        <span>97% Satisfaction Rate</span>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>{t("successStories.title", "Past Event Success Stories")}</h2>
        <p className={styles.subtitle}>{t("successStories.subtitle", "Proven track record with international organizations")}</p>
      </div>

      <ReviewGrid 
        items={mappedStories} 
        pageSize={PAGE_SIZE} 
        gridClassName={styles.grid}
        renderItem={(item, i) => <TestimonialCard key={i} testimonial={item} />} 
      />
    </section>
  );
}
