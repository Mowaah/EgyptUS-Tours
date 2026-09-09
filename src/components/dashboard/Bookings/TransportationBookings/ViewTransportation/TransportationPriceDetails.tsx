"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ViewTransportation.module.scss";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface TransportationPriceDetailsProps {
  details?: any;
  overview?: any;
  vehicleCard?: any;
  transfer?: any;
  payload?: any;
}

export default function TransportationPriceDetails({
  details,
  overview,
  vehicleCard,
  transfer,
  payload,
}: TransportationPriceDetailsProps) {
  const vehicleId =
    payload?.vehicle_id ||
    payload?.transfer?.vehicle_id ||
    transfer?.vehicle_id ||
    payload?.vehicle?.id ||
    payload?.vehicle_card?.id ||
    vehicleCard?.id;

  const linkHref = vehicleId
    ? `/dashboard/catalog/transportation/${vehicleId}/overview`
    : null;

  const vehicleName =
    vehicleCard?.name ||
    payload?.vehicle?.name ||
    transfer?.vehicle_name ||
    payload?.vehicle_name;

  const vehicleClass =
    vehicleCard?.vehicle_type ||
    vehicleCard?.vehicle_class ||
    payload?.vehicle?.category ||
    transfer?.vehicle_class ||
    payload?.vehicle_class;

  const title =
    vehicleName && vehicleClass
      ? `${vehicleClass.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())} – ${vehicleName}`
      : vehicleName ||
        (vehicleClass
          ? vehicleClass.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
          : "Vehicle Details");

  let imgSrc = "/images/car1.jpg";
  const rawImg =
    vehicleCard?.image_url ||
    payload?.vehicle?.image_url ||
    transfer?.image_url ||
    details?.image_url ||
    payload?.image_url;

  if (rawImg) {
    imgSrc = rawImg.startsWith("http")
      ? rawImg
      : `${BASE_URL}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;
  }

  const rawCurrency = (
    payload?.currency ||
    overview?.currency ||
    details?.currency ||
    "usd"
  ).toLowerCase();

  const currencySymbol =
    rawCurrency === "usd"
      ? "$"
      : rawCurrency === "eur"
      ? "€"
      : `${rawCurrency.toUpperCase()} `;

  const items =
    details?.items ||
    details?.line_items ||
    payload?.price_details?.items ||
    payload?.price_details?.line_items ||
    [];

  const additionalServices =
    payload?.additional_services ||
    transfer?.additional_services ||
    details?.additional_services ||
    [];

  // Determine actual overall total price from all possible sources
  const totalAmount = Number(
    overview?.total ??
    payload?.total_price ??
    payload?.total_amount ??
    transfer?.total_price ??
    transfer?.price ??
    details?.total ??
    details?.base_price ??
    vehicleCard?.base_price ??
    vehicleCard?.price ??
    0
  );

  const formatCost = (val: number) =>
    `${currencySymbol}${Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const tripType = transfer?.trip_type || payload?.trip_type;
  const tripTypeLabel = tripType
    ? tripType === "round_trip"
      ? "Round Trip Transfer"
      : "One Way Transfer"
    : "Private Transfer";

  const routeSubtitle =
    transfer?.route ||
    (transfer?.pickup_location && transfer?.dropoff_location
      ? `${transfer.pickup_location} → ${transfer.dropoff_location}`
      : "");

  return (
    <div className={`${styles.card} ${styles.firstRowCard}`}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image
              src="/images/dashboard/booking/trips/view/price.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden
            />
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
            style={{ objectFit: "cover" }}
            unoptimized={imgSrc.startsWith("http")}
          />
        </div>

        <div className={styles.priceListContainer}>
          <div className={styles.priceTitleRow}>
            {linkHref ? (
              <Link
                href={linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.priceTitleLink}
              >
                <span className={styles.priceTitle}>{title}</span>
                <span className={styles.exportButton}>
                  <Image
                    src="/images/dashboard/booking/trips/view/export.svg"
                    alt="open link"
                    width={20}
                    height={20}
                  />
                </span>
              </Link>
            ) : (
              <div className={styles.priceTitleContent}>
                <span className={styles.priceTitle}>{title}</span>
                <div className={styles.exportButton}>
                  <Image
                    src="/images/dashboard/booking/trips/view/export.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.priceList}>
            {items.length > 0 ? (
              items.map((item: any, idx: number) => {
                const qty = Number(item.quantity) || 1;
                const name = item.name || item.title || item.label || "Service";
                const cost = Number(item.price ?? item.amount ?? item.line_total ?? 0);
                return (
                  <div key={idx} className={styles.priceListItem}>
                    <div className={styles.priceItemLeft}>
                      <span className={styles.priceItemName}>
                        {qty > 1 ? `${qty} × ` : ""}
                        {name}
                      </span>
                      {item.subtitle && (
                        <span className={styles.priceItemSubtitle}>{item.subtitle}</span>
                      )}
                    </div>
                    <span className={styles.priceItemCost}>{formatCost(cost)}</span>
                  </div>
                );
              })
            ) : additionalServices.length > 0 ? (
              <>
                {(() => {
                  const addonsSum = additionalServices.reduce(
                    (sum: number, s: any) => sum + (Number(s.price || s.amount) || 0),
                    0
                  );
                  const basePrice = Math.max(0, totalAmount - addonsSum);
                  return (
                    <div className={styles.priceListItem}>
                      <div className={styles.priceItemLeft}>
                        <span className={styles.priceItemName}>{tripTypeLabel}</span>
                        {routeSubtitle && (
                          <span className={styles.priceItemSubtitle}>{routeSubtitle}</span>
                        )}
                      </div>
                      <span className={styles.priceItemCost}>{formatCost(basePrice)}</span>
                    </div>
                  );
                })()}
                {additionalServices.map((addon: any, idx: number) => (
                  <div key={idx} className={styles.priceListItem}>
                    <div className={styles.priceItemLeft}>
                      <span className={styles.priceItemName}>
                        {addon.quantity ? `${addon.quantity} × ` : ""}
                        {addon.name || addon.title || "Additional Service"}
                      </span>
                    </div>
                    <span className={styles.priceItemCost}>
                      {formatCost(Number(addon.price || addon.amount || 0))}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className={styles.priceListItem}>
                <div className={styles.priceItemLeft}>
                  <span className={styles.priceItemName}>{tripTypeLabel}</span>
                  {routeSubtitle && (
                    <span className={styles.priceItemSubtitle}>{routeSubtitle}</span>
                  )}
                </div>
                <span className={styles.priceItemCost}>{formatCost(totalAmount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
