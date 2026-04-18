"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { TestimonialCard, Button } from '@/components/shared';
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
  const [visible, setVisible] = useState(PAGE_SIZE);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>What Our Corporate Partners Say</h2>
        <p className={styles.subtitle}>Hear from organizations that partnered with us for high-impact corporate.</p>
      </div>

      <div className={styles.grid}>
        {TESTIMONIALS.slice(0, visible).map((t, i) => (
          <TestimonialCard key={i} testimonial={t} />
        ))}
      </div>

      {visible < TESTIMONIALS.length && (
        <div className={styles.loadMoreWrap}>
          <Button
            variant="outline"
            icon={
              <Image
                src="/images/arrows/arrow-right-blue.svg"
                alt=""
                width={20}
                height={20}
                style={{ transform: "rotate(90deg)" }}
              />
            }
            onClick={() => setVisible(v => v + PAGE_SIZE)}
          >
            Load More
          </Button>
        </div>
      )}
    </section>
  );
}
