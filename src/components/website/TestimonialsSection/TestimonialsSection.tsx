"use client";

import { useState } from "react";
import { SectionHeader, Pagination, TestimonialCard } from "@/components/shared";
import type { Testimonial } from "@/components/shared/TestimonialCard/TestimonialCard";
import type { BackendTestimonial } from "@/services/testimonialsService";
import styles from "./TestimonialsSection.module.scss";



export default function TestimonialsSection({
  initialTestimonials = [],
}: {
  initialTestimonials?: BackendTestimonial[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(initialTestimonials.length / 4) || 15);

  const testimonialsData: Testimonial[] = initialTestimonials.map(t => ({
    videoUrl: t.video_url || undefined,
    quote: `"${t.description}"`,
    name: t.customer_name,
    location: t.country,
    rating: t.rating,
  }));

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          label="Testimonial"
          heading="What Travelers Say"
          description="Don't just take our word for it—hear from those who've experienced the magic"
          descriptionMaxWidth="600px"
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
