import Image from "next/image";
import Link from "next/link";
import { Trip } from "@/types";
import Button from "@/components/shared/Button/Button";
import styles from "./TripOverview.module.scss";

interface TripOverviewProps {
  trip: Trip;
}

export default function TripOverview({ trip }: TripOverviewProps) {
  const ov = trip.overview;

  return (
    <section id="overview" className={styles.section}>
      <div className={styles.layout}>
        {/* ── Left: content ── */}
        <div className={styles.content}>
          <h2 className={styles.heading}>Overview</h2>

          {ov?.description && (
            <>
              <h3 className={styles.label}>Description</h3>
              <p className={styles.text}>{ov.description}</p>
            </>
          )}

          {ov?.culturalValue && (
            <>
              <h3 className={styles.label}>Cultural Value</h3>
              <p className={styles.text}>{ov.culturalValue}</p>
            </>
          )}

          {ov?.whoIsItFor && (
            <>
              <h3 className={styles.label}>Who is this trip for?</h3>
              <p className={styles.text}>{ov.whoIsItFor}</p>
            </>
          )}
        </div>

        {/* ── Right: booking sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.bookCard}>
            <h3 className={styles.bookTitle}>Book Your Trip</h3>
            <p className={styles.bookSubtitle}>
              Choose between a private experience or a group trip tailored to your preference.
            </p>
            <div className={styles.divider} />

            <div className={styles.pricingContainer}>
              <div className={styles.priceRow}>
                <div>
                  <span className={styles.tierLabel}>Private Tour</span>
                  <span className={styles.tierSub}>Maximum flexibility</span>
                </div>
                <span className={styles.tierPrice}>
                  ${trip.privatePrice?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className={styles.pricingContainer}>
              <div className={styles.priceRow}>
                <div>
                  <span className={styles.tierLabel}>Group Tour</span>
                  <span className={styles.tierSub}>Up to 12 travelers</span>
                </div>
                <span className={styles.tierPrice}>
                  ${trip.groupPrice?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className={styles.ctas}>
              <Link href={`/trips/${trip.id}/book-private`} style={{ textDecoration: 'none' }}>
                <Button
                  variant="secondary"
                  fullWidth
                  icon={<Image src="/images/profile.svg" alt="" width={24} height={24} />}
                  iconPosition="right"
                >
                  Book Private Trip
                </Button>
              </Link>
              <Link href={`/trips/${trip.id}/book-group`} style={{ textDecoration: 'none' }}>
                <Button
                  variant="secondary-outline"
                  fullWidth
                  icon={<Image src="/images/profile2.svg" alt="" width={24} height={24} />}
                  iconPosition="right"
                >
                  Book Group Trip
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
