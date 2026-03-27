import Link from "next/link";
import { Trip } from "@/types";
import styles from "./TripImportantLinks.module.scss";

interface Props { trip: Trip; }

export default function TripImportantLinks({ trip }: Props) {
  const links = trip.importantLinks ?? [];
  if (!links.length) return null;

  return (
    <section id="more-adventures" className={styles.section}>
      <div className={styles.banner}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#EF4444" opacity="0.15"/>
          <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Please make sure to review the following links</span>
      </div>

      <h2 className={styles.heading}>Important links</h2>
      <p className={styles.subtitle}>
        They include important information about our policies, privacy terms, payment details, and related guidelines.
      </p>

      <div className={styles.pills}>
        {links.map((link, i) => (
          <Link key={i} href={link.href} className={styles.pill}>
            {link.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
