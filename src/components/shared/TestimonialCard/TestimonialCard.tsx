import Image from "next/image";
import StarRating from "../StarRating/StarRating";
import styles from "./TestimonialCard.module.scss";

export interface Testimonial {
  image: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
}

interface Props {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.videoWrapper}>
        <div className={styles.videoThumb}>
          <Image
            src={testimonial.image}
            alt={testimonial.name}
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
        <p className={styles.quote}>{testimonial.quote}</p>
        <div className={styles.reviewer}>
          <span className={styles.reviewerName}>{testimonial.name}</span>
          <div className={styles.reviewerMeta}>
            <div className={styles.locationWrap}>
              <Image src="/images/en.svg" alt="flag" width={18} height={12} />
              <span className={styles.reviewerLocation}>{testimonial.location}</span>
            </div>
            <StarRating value={testimonial.rating} />
          </div>
        </div>
      </div>
    </div>
  );
}
