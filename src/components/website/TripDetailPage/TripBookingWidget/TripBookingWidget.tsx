"use client";

import Image from "next/image";
import Link from "next/link";
import { Trip } from "@/types";
import Button from "@/components/shared/Button/Button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./TripBookingWidget.module.scss";

interface TripBookingWidgetProps {
  trip: Trip;
}

export default function TripBookingWidget({ trip }: TripBookingWidgetProps) {
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("trips");

  function formatPrice(value?: number) {
    return value != null ? formatCurrency(value) : null;
  }

  const privatePrice = formatPrice(trip.privatePrice);
  const groupPrice = formatPrice(trip.groupPrice);

  function mobileLabel(price: string | null, action: string) {
    return price ? (
      <>
        {t("bookingWidget.from", "From")} <strong>{price}</strong> / {action}
      </>
    ) : (
      action
    );
  }

  return (
    <aside className={styles.sidebar} aria-label="Book this tour">
      <div className={styles.card}>
        <div className={styles.desktop}>
          <h3 className={styles.title}>{t("bookingWidget.title", "Book Your Tour")}</h3>
          <p className={styles.subtitle}>
            {t("bookingWidget.subtitle", "Choose between a private experience or a group tour tailored to your preference.")}
          </p>
          <div className={styles.divider} />

          {trip.privatePrice != null && (
            <div className={styles.tier}>
              <div>
                <span className={styles.tierName}>{t("bookingWidget.privateTour", "Private Tour")}</span>
                <span className={styles.tierHint}>{t("bookingWidget.maximumFlexibility", "Maximum flexibility")}</span>
              </div>
              <span className={styles.tierPrice}>{formatPrice(trip.privatePrice)}</span>
            </div>
          )}

          {trip.groupPrice != null && (
            <div className={styles.tier}>
              <div>
                <span className={styles.tierName}>{t("bookingWidget.groupTour", "Group Tour")}</span>
                <span className={styles.tierHint}>{t("bookingWidget.upTo12Travelers", "Up to 12 travelers")}</span>
              </div>
              <span className={styles.tierPrice}>{formatPrice(trip.groupPrice)}</span>
            </div>
          )}

          <div className={styles.actions}>
            {trip.offersPrivateTour !== false && (
              <Link href={`/egypttours/${trip.id}/book-private`} className={styles.cta}>
                <Button
                  variant="secondary"
                  fullWidth
                  icon={<Image src="/images/profile.svg" alt="" width={24} height={24} />}
                  iconPosition="right"
                >
                  {t("bookingWidget.bookPrivateTour", "Book Private Tour")}
                </Button>
              </Link>
            )}
            {trip.offersGroupTour !== false && (
              <Link href={`/egypttours/${trip.id}/book-group`} className={styles.cta}>
                <Button
                  variant="secondary-outline"
                  fullWidth
                  icon={<Image src="/images/profile2.svg" alt="" width={24} height={24} />}
                  iconPosition="right"
                >
                  {t("bookingWidget.bookGroupTour", "Book Group Tour")}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {trip.offersPrivateTour !== false && (
          <Link
            href={`/egypttours/${trip.id}/book-private`}
            className={`${styles.mobileBtn} ${styles.mobileBtnFilled}`}
          >
            <span>{mobileLabel(privatePrice, t("bookingWidget.bookPrivateTour", "Book Private Tour"))}</span>
            <Image src="/images/profile.svg" alt="" width={24} height={24} />
          </Link>
        )}
        {trip.offersGroupTour !== false && (
          <Link
            href={`/egypttours/${trip.id}/book-group`}
            className={`${styles.mobileBtn} ${styles.mobileBtnOutline}`}
          >
            <span>{mobileLabel(groupPrice, t("bookingWidget.bookGroupTour", "Book Group Tour"))}</span>
            <Image src="/images/profile2.svg" alt="" width={24} height={24} />
          </Link>
        )}
      </div>
    </aside>
  );
}
