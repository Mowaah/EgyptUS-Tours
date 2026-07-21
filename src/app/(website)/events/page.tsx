import EventsPage from "@/components/website/EventsPage/EventsPage";

export const metadata = {
  title: "Events & MICE | EgyptUS Tours",
  description: "Professional corporate events and MICE solutions in Egypt.",
};

import { getTestimonials } from "@/services/testimonialsService";

export default async function EventsRoute() {
  const testimonials = await getTestimonials({ category: 'mice' });
  return <EventsPage testimonials={testimonials} />;
}
