import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";

interface PriceDetailsProps {
  details: any;
  overview: any;
}

export default function PriceDetails({ details, overview }: PriceDetailsProps) {
  const items = details?.items || details?.line_items || [];
  const title = details?.title || "Booking Details";

  return (
    <div className={`${styles.card} ${styles.firstRowCard}`}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image src="/images/dashboard/booking/trips/view/price.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          Price Details
        </div>
      </div>

      <div className={styles.priceDetailsWrapper}>
        <div className={styles.priceImageContainer}>
          <Image 
            src="/images/pyramids2.jpg" // placeholder image
            alt="Trip Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className={styles.priceListContainer}>
          <div className={styles.priceTitleRow}>
            <span className={styles.priceTitle}>
              {title}
            </span>
            <button type="button" className={styles.exportButton}>
              <Image src="/images/dashboard/booking/trips/view/export.svg" alt="export" width={20} height={20} />
            </button>
          </div>

          <div className={styles.priceList}>
            {items.map((item: any, idx: number) => {
              const rawType = item.type_label || item.room_type || "";
              const capType = rawType ? rawType.charAt(0).toUpperCase() + rawType.slice(1) : "";
              const label = item.name || (capType ? `${capType}${item.view_label ? ` - ${item.view_label}` : ""}` : "Room");
              return (
                <div key={idx} className={styles.priceListItem}>
                  <span className={styles.priceItemName}>
                    {item.quantity ? `${item.quantity} × ` : ""}
                    {label}
                    {details?.nights ? ` (${details.nights} ${details.nights === 1 ? 'night' : 'nights'})` : ""}
                  </span>
                  <span className={styles.priceItemCost}>${item.price || item.amount || item.line_total}</span>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className={styles.priceListItem}>
                <span className={styles.priceItemName}>Base Price</span>
                <span className={styles.priceItemCost}>${overview?.total || "0"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
