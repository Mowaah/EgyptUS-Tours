"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Vehicle, TransportationBookingData } from "@/types";
import useSWR from "swr";
import { apiClient } from "@/lib/api";
import { useCurrency } from "@/contexts/CurrencyContext";
import { MultiCurrencyPrice } from "@/constants/currency";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./BookingSummary.module.scss";

const fetcher = (url: string) => apiClient.get(url).then((res: any) => res.results || res);

interface BookingSummaryProps {
  vehicle: Vehicle;
  formData: TransportationBookingData;
}

export default function BookingSummary({ vehicle, formData }: BookingSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation("booking");
  const { formatCurrency } = useCurrency();

  const { data: vehicleDetailsData } = useSWR(vehicle.id ? `/vehicles/${vehicle.id}/` : null, fetcher);
  const additionalServices = vehicleDetailsData?.additional_services || [];

  const basePrice = parseFloat((vehicle.price ?? "0").replace(/[^0-9.]/g, "")) || 0;

  const selectedServices = additionalServices.filter((s: any) =>
    formData.additionalServiceIds?.includes(s.id)
  );

  const calculateTotalForCurrency = (curr: "usd" | "egp" | "eur") => {
    let base = 0;
    if (curr === "egp") base = Number(vehicle.prices?.egp) || (parseFloat(vehicle.price ?? "0") || 0);
    else if (curr === "eur") base = Number(vehicle.prices?.eur) || (parseFloat(vehicle.price ?? "0") || 0);
    else base = Number(vehicle.prices?.usd) || (parseFloat(vehicle.price ?? "0") || 0);

    const sTotal = selectedServices.reduce((acc: number, s: any) => {
      let sp = parseFloat(s.price) || 0;
      if (curr === "egp" && s.price_egp != null) sp = parseFloat(s.price_egp);
      else if (curr === "eur" && s.price_eur != null) sp = parseFloat(s.price_eur);
      return acc + sp;
    }, 0);

    return base + sTotal;
  };

  const totalPrices: MultiCurrencyPrice = useMemo(() => ({
    usd: calculateTotalForCurrency("usd"),
    egp: calculateTotalForCurrency("egp"),
    eur: calculateTotalForCurrency("eur"),
  }), [vehicle, selectedServices]);

  const isDepositFull = useMemo(() => {
    if (!formData.pickupDate) return false;
    const start = new Date(formData.pickupDate);
    const today = new Date();
    const daysUntil = (start.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysUntil <= 30;
  }, [formData.pickupDate]);

  const depositFactor = isDepositFull ? 1 : 0.3;
  const depositPrices: MultiCurrencyPrice = useMemo(() => ({
    usd: (Number(totalPrices.usd) || 0) * depositFactor,
    egp: (Number(totalPrices.egp) || 0) * depositFactor,
    eur: (Number(totalPrices.eur) || 0) * depositFactor,
  }), [totalPrices, depositFactor]);

  const remainingPrices: MultiCurrencyPrice = useMemo(() => ({
    usd: (Number(totalPrices.usd) || 0) - (Number(depositPrices.usd) || 0),
    egp: (Number(totalPrices.egp) || 0) - (Number(depositPrices.egp) || 0),
    eur: (Number(totalPrices.eur) || 0) - (Number(depositPrices.eur) || 0),
  }), [totalPrices, depositPrices]);

  const pickupShort = formData.pickupLocation
    ? formData.pickupLocation.split(",")[0]
    : "Pickup";
  const dropoffShort = formData.dropoffLocation
    ? formData.dropoffLocation.split(",")[0]
    : "Drop-off";

  return (
    <aside className={styles.sidebar}>
      {/* ── Compact strip (mobile only) ─────────────────────────────────────── */}
      <button
        type="button"
        className={`${styles.compactSummary} ${expanded ? styles.compactSummaryHidden : ""}`}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="transport-summary-details"
      >
        <div className={styles.compactText}>
          <span className={styles.compactTitle}>{vehicle.type} – {vehicle.name}</span>
          <span className={styles.compactRoute}>{pickupShort} → {dropoffShort}</span>
        </div>
        <div className={styles.compactRight}>
          <span className={styles.compactTotal}>{formatCurrency(totalPrices)}</span>
          <svg
            className={`${styles.compactChevron} ${expanded ? styles.compactChevronOpen : ""}`}
            width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* ── Full details ────────────────────────────────────────────────────── */}
      <div
        id="transport-summary-details"
        className={styles.details}
        hidden={!expanded}
      >
        <div className={styles.card}>
          {/* Collapse button — only shown on mobile when expanded */}
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setExpanded(false)}
            aria-label="Hide summary"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Hide summary
          </button>
          <div className={styles.inner}>
            <div className={styles.header}>
              <h2 className={styles.title}>{t("sidebar.bookingSummary", "Booking Summary")}</h2>
              <div className={styles.ratingBox}>
                <div className={styles.starIcon}>
                  <Image src="/images/star-yellow3.svg" alt="" width={18} height={18} />
                </div>
                <span className={styles.ratingVal}>{vehicle.rating}</span>
              </div>
            </div>

            <div className={styles.mainContent}>
              <div className={styles.vehicleSection}>
                <div className={styles.vehicleImage}>
                  <Image src={vehicle.image} alt={vehicle.name} fill style={{ objectFit: 'contain' }} />
                </div>

                <div className={styles.vehicleDetails}>
                  <h3 className={styles.vehicleName}>{vehicle.type} - {vehicle.name}</h3>

                  <div className={styles.priceTable}>
                    <div className={styles.priceRow}>
                      <span className={styles.priceLabel}>{t("sidebar.basePrice", "Base Price")}</span>
                      <span className={styles.priceValue}>{formatCurrency(vehicle.prices || basePrice)}</span>
                    </div>
                    {selectedServices.map((s: any) => {
                      const servicePrices = {
                        usd: parseFloat(s.price) || 0,
                        egp: s.price_egp != null ? parseFloat(s.price_egp) : undefined,
                        eur: s.price_eur != null ? parseFloat(s.price_eur) : undefined,
                      };
                      return (
                        <div className={styles.priceRow} key={s.id}>
                          <span className={styles.priceLabel}>{s.name}</span>
                          <span className={styles.priceValue}>+{formatCurrency(servicePrices)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>{t("sidebar.total", "Total")}</span>
                <span className={styles.totalAmount}>{formatCurrency(totalPrices)}</span>
              </div>

              <div className={styles.depositBox}>
                <div className={styles.depositRow}>
                  <span className={styles.depositLabel}>{t("sidebar.payNow", "Pay now")} {depositFactor === 1 ? t("sidebar.fullAmount", "(Full amount)") : t("sidebar.deposit30", "(30% deposit)")}</span>
                  <span className={styles.depositAmount}>{formatCurrency(depositPrices)}</span>
                </div>
                <div className={styles.remainingRow}>
                  <span className={styles.remainingNote}>{t("sidebar.remainingNote", "Remaining 70% due one month before your trip")}</span>
                  <span className={styles.remainingVal}>{formatCurrency(remainingPrices)}</span>
                </div>
              </div>

              <div className={styles.trustBadges}>
                {[
                  t("sidebar.freeCancellation", "Free cancellation"),
                  t("sidebar.support247", "24/7 support"),
                  t("sidebar.securePayment", "Secure Payment"),
                ].map((text) => (
                  <div key={text} className={styles.badge}>
                    <div className={styles.badgeIcon}>
                      <Image src="/images/check-green.svg" alt="" width={16} height={16} />
                    </div>
                    <span className={styles.badgeText}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
