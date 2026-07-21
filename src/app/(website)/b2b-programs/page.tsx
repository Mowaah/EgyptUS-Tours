import React from 'react';
import B2BProgramsPage from '@/components/website/B2BProgramsPage/B2BProgramsPage';

export const metadata = {
  title: "B2B Programs | Corporate Travel & Event Experiences",
  description: "Our B2B division is dedicated to building long-term partnerships with companies seeking reliable, results-driven corporate event and travel solutions.",
};

import { getTestimonials } from '@/services/testimonialsService';

export default async function Page() {
  const testimonials = await getTestimonials({ category: 'mice' });
  return <B2BProgramsPage testimonials={testimonials} />;
}
