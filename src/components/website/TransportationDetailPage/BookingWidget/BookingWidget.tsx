"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shared";
import styles from "./BookingWidget.module.scss";

interface BookingWidgetProps {
  vehicleId: string;
  totalPrice?: string;
}

export default function BookingWidget({ vehicleId, totalPrice = "$1299" }: BookingWidgetProps) {
  const bookHref = `/transportation/${vehicleId}/book`;

  return (
    <aside className={styles.sidebar} aria-label="Book this vehicle">
      <div className={styles.card}>
        <div className={styles.desktop}>
          <div className={styles.header}>
            <h3 className={styles.cardTitle}>Book This Vehicle</h3>
            <p className={styles.cardDesc}>Customize your journey across Egypt with ease</p>
          </div>

          <div className={styles.divider} />

          <div className={styles.rowsSection}>
            <div className={styles.row}>
              <span className={styles.label}>Base Price</span>
              <span className={styles.value}>$85.42</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Service Fee</span>
              <span className={styles.value}>$10.00</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Insurance</span>
              <span className={styles.value}>$5.00</span>
            </div>
          </div>

          <div className={styles.totalContainer}>
            <div className={styles.totalBox}>
              <div className={styles.totalLabelWrap}>
                <span className={styles.totalLabel}>Start From</span>
                <span className={styles.perDay}>Per Day</span>
              </div>
              <span className={styles.totalPrice}>{totalPrice}</span>
            </div>
          </div>

          <div className={styles.footer}>
            <Button
              variant="secondary"
              fullWidth
              className={styles.bookBtn}
              href={bookHref}
              icon={<Image src="/images/money-send.svg" alt="" width={20} height={20} />}
              iconPosition="right"
            >
              Book Now
            </Button>
          </div>
        </div>

        <div className={styles.mobile}>
          <div className={styles.content}>
            <div className={styles.priceBox}>
              <div className={styles.priceText}>
                <span className={styles.mobilePriceLabel}>Start From</span>
                <span className={styles.mobilePriceHint}>Per Day</span>
              </div>
              <span className={styles.mobilePriceValue}>{totalPrice}</span>
            </div>
          </div>

          <div className={styles.mobileDivider} role="presentation" />

          <div className={styles.actions}>
            <Link href={bookHref} className={styles.cta}>
              Book Now
              <Image
                src="/images/money-send.svg"
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
