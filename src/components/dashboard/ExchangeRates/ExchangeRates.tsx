"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { mutate } from "swr";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  DashboardField,
  DashboardStatusBanner,
  DashboardFooter,
} from "@/components/dashboard/shared";
import {
  updateExchangeRates,
  type ExchangeRatesData,
} from "@/services/admin/adminExchangeRatesService";
import { formatDateDDMMYYYY } from "@/utils/dateFormat";
import styles from "./ExchangeRates.module.scss";

interface ExchangeRatesProps {
  initialData?: ExchangeRatesData;
}

const SUCCESS_MESSAGE =
  "Exchange rates updated successfully. Catalog prices have been recalculated.";

export default function ExchangeRates({ initialData }: ExchangeRatesProps) {
  const { canEdit } = useAdminAuth();
  const userCanEdit = canEdit("settings");

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
              src="/images/dashboard/sidebar/financial-reports.svg"
              alt=""
              width={20}
              height={20}
            />
          </span>
          <h2 id="exchange-rates-title">Currency Exchange Rates</h2>
        </div>

        <div className={styles.fieldGrid}>
          <DashboardField
            id="field-usd-to-egp"
            variant="modal"
            label="USD to EGP Rate (1 USD = X EGP)"
            value={usdToEgp}
            disabled={!userCanEdit}
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
            disabled={!userCanEdit}
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
          <p className={styles.apiError}>
            {apiError}
          </p>
        )}
      </section>

      <DashboardFooter
        lastUpdateDate={
          initialData?.updated_at
            ? formatDateDDMMYYYY(initialData.updated_at)
            : ""
        }
        isSubmit={true}
        hideActions={!userCanEdit}
        onDiscard={handleDiscard}
        isSaveDisabled={isSaving || !hasUnsavedChanges}
        isDiscardDisabled={isSaving || !hasUnsavedChanges}
        isSaving={isSaving}
      />
    </form>
  );
}
