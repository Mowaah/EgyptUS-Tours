import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seoUtils";
import EventsPage from "@/components/website/EventsPage/EventsPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    pageKey: "mice_events",
    fallbackTitle: "Events & MICE | Egypt-Us",
    fallbackDescription: "Professional corporate events and MICE solutions in Egypt.",
  });
}

import { getTestimonials } from "@/services/testimonialsService";

export default async function EventsRoute() {
  const testimonials = await getTestimonials({ category: 'mice' });
  return <EventsPage testimonials={testimonials} />;
}
