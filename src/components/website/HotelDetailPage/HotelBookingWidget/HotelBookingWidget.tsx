"use client";

import Image from "next/image";
import Link from "next/link";
import { Hotel } from "@/types";
import Button from "@/components/shared/Button/Button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./HotelBookingWidget.module.scss";

interface HotelBookingWidgetProps {
  hotel: Hotel;
}

export default function HotelBookingWidget({ hotel }: HotelBookingWidgetProps) {
  const bookHref = `/hotels/${hotel.id}/book`;
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("hotels");
  const price = formatCurrency(hotel.pricePerNight);

  return (
    <aside className={styles.sidebar} aria-label="Book this hotel">
      <div className={styles.card}>
        <div className={styles.desktop}>
          <h3 className={styles.title}>{t("bookingWidget.title", "Plan Your Stay")}</h3>
          <p className={styles.subtitle}>
            {t("bookingWidget.subtitle", "Choose your check-in and check-out dates and select the number of rooms.")}
          </p>

          <div className={styles.divider} />

          <div className={styles.priceContainer}>
            <div className={styles.priceRow}>
              <div>
                <span className={styles.priceLabel}>{t("bookingWidget.startFrom", "Start From")}</span>
                <span className={styles.priceSub}>{t("bookingWidget.perNight", "Per Night")}</span>
              </div>
              <span className={styles.priceValue}>{price}</span>
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
              {t("bookingWidget.checkRoomsAndDates", "Check Rooms & Dates")}
            </Button>
          </div>

          <p className={styles.cancelPolicy}>
            {t("bookingWidget.cancellationPolicy", "Free cancellation up to 24 hours before")}
          </p>
        </div>

        <div className={styles.mobile}>
          <div className={styles.content}>
            <div className={styles.priceBox}>
              <div className={styles.priceText}>
                <span className={styles.mobilePriceLabel}>{t("bookingWidget.startFrom", "Start From")}</span>
                <span className={styles.mobilePriceHint}>{t("bookingWidget.perNight", "Per Night")}</span>
              </div>
              <span className={styles.mobilePriceValue}>{price}</span>
            </div>
          </div>

          <div className={styles.mobileDivider} role="presentation" />

          <div className={styles.actions}>
            <Link href={bookHref} className={styles.cta}>
              {t("bookingWidget.checkRoomsAndDates", "Check Rooms & Dates")}
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
