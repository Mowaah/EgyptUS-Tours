import React from 'react';
import type { Metadata } from 'next';
import { generateSeoMetadata } from '@/lib/seoUtils';
import B2BProgramsPage from '@/components/website/B2BProgramsPage/B2BProgramsPage';

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    pageKey: "b2b",
    fallbackTitle: "B2B Programs | Egypt-Us",
    fallbackDescription: "Our B2B division is dedicated to building long-term partnerships with companies seeking reliable, results-driven corporate event and travel solutions.",
  });
}

import { getTestimonials } from '@/services/testimonialsService';

export default async function Page() {
  const testimonials = await getTestimonials({ category: 'b2b' });
  return <B2BProgramsPage testimonials={testimonials} />;
}
