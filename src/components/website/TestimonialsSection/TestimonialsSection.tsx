"use client";

import { useState } from "react";
import { SectionHeader, Pagination, TestimonialCard, EmptyState } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import type { Testimonial } from "@/components/shared/TestimonialCard/TestimonialCard";
import type { TestimonialData } from "@/services/testimonialsService";
import { COUNTRIES } from "@/data/countries";
import styles from "./TestimonialsSection.module.scss";

const ITEMS_PER_PAGE = 3;

export default function TestimonialsSection({
  initialTestimonials = [],
}: {
  initialTestimonials?: TestimonialData[];
}) {
  const { t } = useTranslation("home");
  const [currentPage, setCurrentPage] = useState(1);

  const testimonialsData: Testimonial[] = initialTestimonials.map((item) => {
    const countryEntry = COUNTRIES.find(
      (c) => c.code.toUpperCase() === (item.country || "").toUpperCase()
    );
    return {
      title: item.title,
      videoUrl: item.video_url || undefined,
      quote: item.description,
      name: item.customer_name,
      location: countryEntry?.name || item.country,
      countryCode: (item.country || "").toLowerCase(),
      rating: item.rating,
      date: item.created_at,
    };
  });

  const totalPages = Math.ceil(testimonialsData.length / ITEMS_PER_PAGE);
  const paginatedTestimonials = testimonialsData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const isEmpty = testimonialsData.length === 0;

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

        {isEmpty ? (
          <div className={styles.empty}>
            <EmptyState
              title={t("testimonials.emptyTitle", "No Available Testimonials")}
              description={t(
                "testimonials.emptyDescription",
                "There are no traveler stories to show right now. Check back soon."
              )}
              buttonText=""
            />
          </div>
        ) : (
          <>
            <div className={styles.cards}>
              {paginatedTestimonials.map((testimonial, i) => (
                <TestimonialCard key={`${testimonial.name}-${i}`} testimonial={testimonial} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.paginationRow}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
