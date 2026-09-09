import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ViewTrip.module.scss";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface PriceDetailsProps {
  details: any;
  overview: any;
  booking?: any;
}

export default function PriceDetails({ details, overview, booking }: PriceDetailsProps) {
  const items = details?.items || details?.line_items || details?.room_overview || booking?.room_selections || [];
  const title =
    details?.trip_title ||
    details?.hotel_name ||
    booking?.trip_title ||
    booking?.hotel_name ||
    details?.title ||
    "Booking Details";

  const tripId =
    details?.trip_id ||
    booking?.trip_id ||
    booking?.trip?.id ||
    (typeof booking?.trip === "number" ? booking.trip : null);

  const hotelId =
    details?.hotel_id ||
    booking?.hotel_id ||
    booking?.hotel?.id ||
    (typeof booking?.hotel === "number" ? booking.hotel : null);

  const linkHref = tripId
    ? `/dashboard/catalog/trips/${tripId}`
    : hotelId
    ? `/dashboard/catalog/hotels/${hotelId}`
    : null;

  let imgSrc = "/images/pyramids2.jpg";
  if (details?.image_url) {
    imgSrc = details.image_url.startsWith("http")
      ? details.image_url
      : `${BASE_URL}${details.image_url.startsWith("/") ? "" : "/"}${details.image_url}`;
  } else if (booking?.trip_image || booking?.image_url) {
    const bImg = booking.trip_image || booking.image_url;
    imgSrc = bImg.startsWith("http")
      ? bImg
      : `${BASE_URL}${bImg.startsWith("/") ? "" : "/"}${bImg}`;
  }

  const rawCurrency = (details?.currency || overview?.currency || "usd").toLowerCase();
  const currencySymbol = rawCurrency === "usd" ? "$" : rawCurrency === "eur" ? "€" : `${rawCurrency.toUpperCase()} `;

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
            src={imgSrc}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized={imgSrc.startsWith("http")}
          />
        </div>

        <div className={styles.priceListContainer}>
          <div className={styles.priceTitleRow}>
            {linkHref ? (
              <Link href={linkHref} target="_blank" rel="noopener noreferrer" className={styles.priceTitleLink}>
                <span className={styles.priceTitle}>{title}</span>
                <span className={styles.exportButton}>
                  <Image src="/images/dashboard/booking/trips/view/export.svg" alt="open link" width={20} height={20} />
                </span>
              </Link>
            ) : (
              <div className={styles.priceTitleContent}>
                <span className={styles.priceTitle}>{title}</span>
                <div className={styles.exportButton}>
                  <Image src="/images/dashboard/booking/trips/view/export.svg" alt="" width={20} height={20} />
                </div>
              </div>
            )}
          </div>

          <div className={styles.priceList}>
            {items.map((item: any, idx: number) => {
              const rawType = item.type_label || item.room_type || item.category || "";
              let capType = rawType ? rawType.charAt(0).toUpperCase() + rawType.slice(1) : "Room";
              if (!capType.toLowerCase().includes("room")) {
                capType = `${capType} Room`;
              }
              const viewLabel = item.view_label || item.room_view || "";
              const label = item.name || (viewLabel ? `${capType} - ${viewLabel}` : capType);
              const quantity = item.quantity || 1;

              const adults = item.adult_count ?? item.adults ?? (idx === 0 ? booking?.adults : 0) ?? 0;
              const children = item.children_count ?? (Array.isArray(item.children) ? item.children.length : (idx === 0 ? booking?.children : 0)) ?? 0;

              let childAges: (number | string)[] = [];
              if (Array.isArray(item.children) && item.children.length > 0) {
                childAges = item.children
                  .map((c: any) => (typeof c === "object" && c !== null ? c.age : c))
                  .filter((a: any) => a !== undefined && a !== null);
              } else if (Array.isArray(item.children_ages) && item.children_ages.length > 0) {
                childAges = item.children_ages;
              } else if (idx === 0 && Array.isArray(booking?.children_ages) && booking.children_ages.length > 0) {
                childAges = booking.children_ages;
              }

              const adultStr = adults > 0 ? `${adults} Adult` : "";
              let childStr = "";
              if (children > 0) {
                if (childAges.length > 0) {
                  childStr = `${children} Child (${childAges.map((a: any) => `${a} years`).join(", ")})`;
                } else {
                  childStr = `${children} Child`;
                }
              }
              const subtitle = [adultStr, childStr].filter(Boolean).join(" , ");

              const costNum = Number(item.price || item.amount || item.line_total || 0);
              const costFormatted = `${currencySymbol}${costNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

              return (
                <div key={idx} className={styles.priceListItem}>
                  <div className={styles.priceItemLeft}>
                    <span className={styles.priceItemName}>
                      {`${quantity} × ${label}`}
                      {details?.nights ? ` (${details.nights} ${details.nights === 1 ? 'night' : 'nights'})` : ""}
                    </span>
                    {subtitle && (
                      <span className={styles.priceItemSubtitle}>
                        {subtitle}
                      </span>
                    )}
                  </div>
                  <span className={styles.priceItemCost}>{costFormatted}</span>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className={styles.priceListItem}>
                <div className={styles.priceItemLeft}>
                  <span className={styles.priceItemName}>Base Price</span>
                </div>
                <span className={styles.priceItemCost}>
                  {currencySymbol}{Number(overview?.total || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
