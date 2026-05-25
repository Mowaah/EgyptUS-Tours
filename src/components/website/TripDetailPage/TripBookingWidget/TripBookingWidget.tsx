import Image from "next/image";
import Link from "next/link";
import { Trip } from "@/types";
import Button from "@/components/shared/Button/Button";
import styles from "./TripBookingWidget.module.scss";

interface TripBookingWidgetProps {
  trip: Trip;
}

function formatPrice(value?: number) {
  return value != null ? `$${value.toLocaleString()}` : null;
}

function mobileLabel(price: string | null, action: string) {
  return price ? (
    <>
      From <strong>{price}</strong> / {action}
    </>
  ) : (
    action
  );
}

export default function TripBookingWidget({ trip }: TripBookingWidgetProps) {
  const privatePrice = formatPrice(trip.privatePrice);
  const groupPrice = formatPrice(trip.groupPrice);

  return (
    <aside className={styles.sidebar} aria-label="Book this trip">
      <div className={styles.card}>
        <div className={styles.desktop}>
          <h3 className={styles.title}>Book Your Trip</h3>
          <p className={styles.subtitle}>
            Choose between a private experience or a group trip tailored to your preference.
          </p>
          <div className={styles.divider} />

          <div className={styles.tier}>
            <div>
              <span className={styles.tierName}>Private Tour</span>
              <span className={styles.tierHint}>Maximum flexibility</span>
            </div>
            <span className={styles.tierPrice}>${trip.privatePrice?.toLocaleString()}</span>
          </div>

          <div className={styles.tier}>
            <div>
              <span className={styles.tierName}>Group Tour</span>
              <span className={styles.tierHint}>Up to 12 travelers</span>
            </div>
            <span className={styles.tierPrice}>${trip.groupPrice?.toLocaleString()}</span>
          </div>

          <div className={styles.actions}>
            <Link href={`/trips/${trip.id}/book-private`} className={styles.cta}>
              <Button
                variant="secondary"
                fullWidth
                icon={<Image src="/images/profile.svg" alt="" width={24} height={24} />}
                iconPosition="right"
              >
                Book Private Trip
              </Button>
            </Link>
            <Link href={`/trips/${trip.id}/book-group`} className={styles.cta}>
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

        <Link
          href={`/trips/${trip.id}/book-private`}
          className={`${styles.mobileBtn} ${styles.mobileBtnFilled}`}
        >
          <span>{mobileLabel(privatePrice, "Book Private Trip")}</span>
          <Image src="/images/profile.svg" alt="" width={24} height={24} />
        </Link>
        <Link
          href={`/trips/${trip.id}/book-group`}
          className={`${styles.mobileBtn} ${styles.mobileBtnOutline}`}
        >
          <span>{mobileLabel(groupPrice, "Book Group Trip")}</span>
          <Image src="/images/profile2.svg" alt="" width={24} height={24} />
        </Link>
      </div>
    </aside>
  );
}
