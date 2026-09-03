"use client";

import { useState } from "react";
import { SectionHeader, Pagination, TestimonialCard } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import type { Testimonial } from "@/components/shared/TestimonialCard/TestimonialCard";
import type { TestimonialData } from "@/services/testimonialsService";
import { COUNTRIES } from "@/data/countries";
import styles from "./TestimonialsSection.module.scss";

export default function TestimonialsSection({
  initialTestimonials = [],
}: {
  initialTestimonials?: TestimonialData[];
}) {
  const { t } = useTranslation("home");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(initialTestimonials.length / 4) || 15);

  const testimonialsData: Testimonial[] = initialTestimonials.map(t => {
    const countryEntry = COUNTRIES.find(c => c.code.toUpperCase() === (t.country || '').toUpperCase());
    return {
      videoUrl: t.video_url || undefined,
      quote: `"${t.description}"`,
      name: t.customer_name,
      location: countryEntry?.name || t.country,
      countryCode: (t.country || '').toLowerCase(),
      rating: t.rating,
    };
  });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          label={t("testimonials.label", "Testimonial")}
          heading={t("testimonials.heading", "What Travelers Say")}
          description={t("testimonials.description", "Discover real stories, honest feedback, and memorable moments from our travelers")}
          descriptionMaxWidth="780px"
          size="large"
        />

        <div className={styles.cards}>
          {testimonialsData.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>

        <div className={styles.paginationRow}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </section>
  );
}
