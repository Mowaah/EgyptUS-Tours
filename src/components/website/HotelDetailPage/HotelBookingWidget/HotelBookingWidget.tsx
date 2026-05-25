import Image from "next/image";
import Link from "next/link";
import { Hotel } from "@/types";
import Button from "@/components/shared/Button/Button";
import styles from "./HotelBookingWidget.module.scss";

interface HotelBookingWidgetProps {
  hotel: Hotel;
}

export default function HotelBookingWidget({ hotel }: HotelBookingWidgetProps) {
  const bookHref = `/hotels/${hotel.id}/book`;
  const price = hotel.pricePerNight?.toLocaleString();

  return (
    <aside className={styles.sidebar} aria-label="Book this hotel">
      <div className={styles.card}>
        <div className={styles.desktop}>
          <h3 className={styles.title}>Plan Your Stay</h3>
          <p className={styles.subtitle}>
            Choose your check-in and check-out dates and select the number of rooms.
          </p>

          <div className={styles.divider} />

          <div className={styles.priceContainer}>
            <div className={styles.priceRow}>
              <div>
                <span className={styles.priceLabel}>Start From</span>
                <span className={styles.priceSub}>Per Night</span>
              </div>
              <span className={styles.priceValue}>${price}</span>
            </div>
          </div>

          <div className={styles.ctas}>
            <Button
              variant="secondary"
              fullWidth
              href={bookHref}
              icon={<Image src="/images/arrows/arrow-right.svg" alt="" width={20} height={20} />}
              iconPosition="right"
            >
              Check Rooms &amp; Dates
            </Button>
          </div>

          <p className={styles.cancelPolicy}>
            Free cancellation up to 24 hours before
          </p>
        </div>

        <div className={styles.mobile}>
          <div className={styles.content}>
            <div className={styles.priceBox}>
              <div className={styles.priceText}>
                <span className={styles.mobilePriceLabel}>Start From</span>
                <span className={styles.mobilePriceHint}>Per Night</span>
              </div>
              <span className={styles.mobilePriceValue}>${price}</span>
            </div>
          </div>

          <div className={styles.mobileDivider} role="presentation" />

          <div className={styles.actions}>
            <Link href={bookHref} className={styles.cta}>
              Check Rooms &amp; Dates
              <Image
                src="/images/arrows/arrow-right.svg"
                alt=""
                width={24}
                height={24}
                className={styles.ctaIcon}
              />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
