"use client";

import { TestimonialCard, ReviewGrid } from '@/components/shared';
import type { Testimonial } from '@/components/shared/TestimonialCard/TestimonialCard';
import styles from './B2BTestimonials.module.scss';

const TESTIMONIALS: Testimonial[] = [
  {
    image: "/images/testimonials/marcus.jpg",
    quote: '"Best trip of my life! The Nile cruise was luxurious and the whole experience was seamlessly organized."',
    name: "Marcus Chen",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/sarah.jpg",
    quote: '"The pyramids tour was absolutely breathtaking! Our guide was incredibly knowledgeable and made history come alive."',
    name: "Sarah Johnson",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/emma.jpg",
    quote: '"Our honeymoon in Egypt was magical! The private tour was perfectly tailored to our interests."',
    name: "Emma & James",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/marcus.jpg",
    quote: '"Best trip of my life! The Nile cruise was luxurious and the whole experience was seamlessly organized."',
    name: "Marcus Chen",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/marcus.jpg",
    quote: '"Best trip of my life! The Nile cruise was luxurious and the whole experience was seamlessly organized."',
    name: "Marcus Chen",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/sarah.jpg",
    quote: '"The pyramids tour was absolutely breathtaking! Our guide was incredibly knowledgeable and made history come alive."',
    name: "Sarah Johnson",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/emma.jpg",
    quote: '"Our honeymoon in Egypt was magical! The private tour was perfectly tailored to our interests."',
    name: "Emma & James",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/marcus.jpg",
    quote: '"Best trip of my life! The Nile cruise was luxurious and the whole experience was seamlessly organized."',
    name: "Marcus Chen",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/marcus.jpg",
    quote: '"Best trip of my life! The Nile cruise was luxurious and the whole experience was seamlessly organized."',
    name: "Marcus Chen",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/sarah.jpg",
    quote: '"The pyramids tour was absolutely breathtaking! Our guide was incredibly knowledgeable and made history come alive."',
    name: "Sarah Johnson",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/emma.jpg",
    quote: '"Our honeymoon in Egypt was magical! The private tour was perfectly tailored to our interests."',
    name: "Emma & James",
    location: "Singapore",
    rating: 4.2,
  },
  {
    image: "/images/testimonials/marcus.jpg",
    quote: '"Best trip of my life! The Nile cruise was luxurious and the whole experience was seamlessly organized."',
    name: "Marcus Chen",
    location: "Singapore",
    rating: 4.2,
  },
];

const PAGE_SIZE = 8;

export default function B2BTestimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>What Our Corporate Partners Say</h2>
        <p className={styles.subtitle}>Hear from organizations that partnered with us for high-impact corporate.</p>
      </div>
      <ReviewGrid 
        items={TESTIMONIALS} 
        pageSize={PAGE_SIZE} 
        gridClassName={styles.grid}
        renderItem={(t, i) => <TestimonialCard key={i} testimonial={t} />} 
      />
    </section>
  );
}
