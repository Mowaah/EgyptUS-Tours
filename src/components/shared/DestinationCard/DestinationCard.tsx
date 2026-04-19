import Image from "next/image";
import styles from "./DestinationCard.module.scss";

interface DestinationCardProps {
  title: string;
  description: string;
  image: string;
  href?: string;
}

export default function DestinationCard({
  title,
  description,
  image,
  href = "#",
}: DestinationCardProps) {
  return (
    <a
      href={href}
      className={styles.card}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 300px"
        className={styles.image}
      />
      <div className={styles.overlay} />
      <span className={styles.arrow}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
        </svg>
      </span>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.cta}>
          Explore more
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        </span>
      </div>
    </a>
  );
}
