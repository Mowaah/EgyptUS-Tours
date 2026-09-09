"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { mutate } from "swr";
import {
  DashboardField,
  DashboardStatusBanner,
  DashboardFooter,
} from "@/components/dashboard/shared";
import {
  updateExchangeRates,
  type ExchangeRatesData,
} from "@/services/admin/adminExchangeRatesService";
import styles from "./ExchangeRates.module.scss";

interface ExchangeRatesProps {
  initialData?: ExchangeRatesData;
}

const SUCCESS_MESSAGE =
  "Exchange rates updated successfully. Catalog prices have been recalculated.";

export default function ExchangeRates({ initialData }: ExchangeRatesProps) {
  const initialEgp = initialData?.usd_to_egp_rate
    ? String(parseFloat(initialData.usd_to_egp_rate))
    : "50.00";
  const initialEur = initialData?.usd_to_eur_rate
    ? String(parseFloat(initialData.usd_to_eur_rate))
    : "0.90";

  const [usdToEgp, setUsdToEgp] = useState(initialEgp);
  const [usdToEur, setUsdToEur] = useState(initialEur);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveNotice, setShowSaveNotice] = useState(false);
  const [apiError, setApiError] = useState("");

  const hasUnsavedChanges = usdToEgp !== initialEgp || usdToEur !== initialEur;

  const isValidRate = (val: string) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  };

  const handleDiscard = () => {
    setUsdToEgp(initialEgp);
    setUsdToEur(initialEur);
    setHasSubmitted(false);
    setApiError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setApiError("");

    if (!isValidRate(usdToEgp) || !isValidRate(usdToEur)) {
      return;
    }

    setIsSaving(true);
    try {
      await updateExchangeRates({
        usd_to_egp_rate: usdToEgp.trim(),
        usd_to_eur_rate: usdToEur.trim(),
      });

      await mutate("/system-config/");
      setShowSaveNotice(true);
      setHasSubmitted(false);
    } catch (error: any) {
      console.error("Failed to update exchange rates:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to update exchange rates. Please ensure values are positive decimals.";
      setApiError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form noValidate className={styles.wrapper} onSubmit={handleSubmit}>
      <DashboardStatusBanner
        show={showSaveNotice}
        onClose={() => setShowSaveNotice(false)}
        message={SUCCESS_MESSAGE}
      />

      <section className={styles.card} aria-labelledby="exchange-rates-title">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon} aria-hidden="true">
            <Image
              src="/images/dashboard/sidebar/finance.svg"
              alt=""
              width={20}
              height={20}
            />
          </span>
          <h2 id="exchange-rates-title">Currency Exchange Rates</h2>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.infoIcon} aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p>
            Catalog prices in the dashboard are sourced in <strong>USD ($)</strong>.
            The rates defined below are used to automatically calculate and convert prices
            into <strong>EGP (E£)</strong> and <strong>EUR (€)</strong> across all published trips,
            hotels, and transportation packages. Saving changes will trigger an automatic recalculation of catalog pricing.
          </p>
        </div>

        <div className={styles.fieldGrid}>
          <DashboardField
            id="field-usd-to-egp"
            variant="modal"
            label="USD to EGP Rate (1 USD = X EGP)"
            value={usdToEgp}
            onChange={(e) => {
              setUsdToEgp(e.target.value);
              if (apiError) setApiError("");
            }}
            placeholder="50.00"
            className={styles.fieldInput}
            error={
              hasSubmitted && !isValidRate(usdToEgp)
                ? "Must be a positive decimal value (e.g. 50.00)"
                : undefined
            }
          />

          <DashboardField
            id="field-usd-to-eur"
            variant="modal"
            label="USD to EUR Rate (1 USD = X EUR)"
            value={usdToEur}
            onChange={(e) => {
              setUsdToEur(e.target.value);
              if (apiError) setApiError("");
            }}
            placeholder="0.90"
            className={styles.fieldInput}
            error={
              hasSubmitted && !isValidRate(usdToEur)
                ? "Must be a positive decimal value (e.g. 0.90)"
                : undefined
            }
          />
        </div>

        {apiError && (
          <p style={{ color: "#ef4444", fontSize: "0.875rem", margin: 0 }}>
            {apiError}
          </p>
        )}
      </section>

      <DashboardFooter
        lastUpdateDate={
          initialData?.updated_at
            ? new Date(initialData.updated_at).toLocaleDateString()
            : ""
        }
        isSubmit={true}
        onDiscard={handleDiscard}
        isSaveDisabled={isSaving || !hasUnsavedChanges}
        isDiscardDisabled={isSaving || !hasUnsavedChanges}
        isSaving={isSaving}
      />
    </form>
  );
}
