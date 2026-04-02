import Link from "next/link";
import Image from "next/image";
import { Trip } from "@/types";
import styles from "./TripImportantLinks.module.scss";

interface Props { trip: Trip; }

export default function TripImportantLinks({ trip }: Props) {
  const links = trip.importantLinks ?? [];
  if (!links.length) return null;

  return (
    <section id="more-adventures" className={styles.section}>
      <div className={styles.banner}>
        <Image src="/images/caution.svg" alt="Important" width={20} height={20} />
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
            <Image src="/images/arrows/arrow-diagonal.svg" alt="arrow" width={30} height={30} className={styles.arrowIcon} />
          </Link>
        ))}
      </div>
    </section>
  );
}
