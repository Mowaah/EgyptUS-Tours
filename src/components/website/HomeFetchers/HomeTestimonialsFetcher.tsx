import TestimonialsSection from "@/components/website/TestimonialsSection/TestimonialsSection";
import { getTestimonials } from "@/services/testimonialsService";

export default async function HomeTestimonialsFetcher() {
  try {
    const testimonialsData = await getTestimonials();
    return <TestimonialsSection initialTestimonials={testimonialsData} />;
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return null;
  }
}
