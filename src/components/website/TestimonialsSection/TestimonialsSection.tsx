import { SectionHeader, PaginationArrows, StarRating } from "@/components/shared";
import Image from "next/image";
import styles from "./TestimonialsSection.module.scss";

const TESTIMONIALS = [
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

export default function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          label="Testimonial"
          heading="What Travelers Say"
          description="Don't just take our word for it—hear from those who've experienced the magic"
          descriptionMaxWidth="600px"
          headingClassName={styles.largeHeading}
        />

        <div className={styles.cards}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.videoWrapper}>
                <div className={styles.videoThumb}>
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className={styles.thumbImg}
                  />
                  <div className={styles.overlay} />
                </div>
                <div className={styles.quoteIcon}>
                  <Image src="/images/quotation.svg" alt="" width={29} height={17} />
                </div>
                <button className={styles.playBtn} aria-label="Play video" style={{ backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)" }}>
                  <Image src="/images/playbtn.svg" alt="" width={20} height={20} />
                </button>
              </div>

              <div className={styles.body}>
                <p className={styles.quote}>{t.quote}</p>
                <div className={styles.reviewer}>
                  <span className={styles.reviewerName}>{t.name}</span>
                  <div className={styles.reviewerMeta}>
                    <Image src="/images/en.svg" alt="flag" width={18} height={12} />
                    <span className={styles.reviewerLocation}>{t.location}</span>
                    <StarRating value={t.rating} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.paginationRow}>
          <PaginationArrows layout="inline" size={32} iconWidth={14} iconHeight={14}>
            <div className={styles.pages}>
              {[1, 2, 3, "...", 13, 14, 15].map((p, i) => (
                <button
                  key={i}
                  className={`${styles.pageBtn} ${p === 1 ? styles.active : ""} ${p === "..." ? styles.dots : ""}`}
                  disabled={p === "..."}
                >
                  {p}
                </button>
              ))}
            </div>
          </PaginationArrows>
        </div>
      </div>
    </section>
  );
}
