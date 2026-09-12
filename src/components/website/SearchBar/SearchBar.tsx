"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.scss";
import { GlassCard, CheckboxDropdown, CustomDatePicker } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchBarProps {
  destinations?: { label: string; value: string; translations?: Record<string, { name?: string }> }[];
}

export default function SearchBar({ destinations = [] }: SearchBarProps) {
  const { t } = useTranslation("home");
  const { formatCurrency } = useCurrency();
  const { language } = useLanguage();
  const [date, setDate] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [tripType, setTripType] = useState("");
  const router = useRouter();

  const destinationOptions = useMemo(() => {
    return destinations.map((d) => ({
      label: d.translations?.[language]?.name || d.label,
      value: d.value,
    }));
  }, [destinations, language]);

  const selectedDestOption = useMemo(
    () => destinationOptions.find((opt) => opt.value === destination),
    [destinationOptions, destination]
  );
  const destinationDisplayLabel = selectedDestOption ? selectedDestOption.label : destination;

  const budgetOptions = useMemo(() => [
    {
      label: t("search.budgetLess1000", "less than {amount}").replace(
        "{amount}",
        formatCurrency({ usd: 1000, eur: 1000, egp: 50000 })
      ),
      value: "less1000",
    },
    {
      label: t("search.budget1000_2000", "{min} - {max}")
        .replace("{min}", formatCurrency({ usd: 1000, eur: 1000, egp: 50000 }))
        .replace("{max}", formatCurrency({ usd: 2000, eur: 2000, egp: 100000 })),
      value: "1000_2000",
    },
    {
      label: t("search.budget2000_3000", "{min} - {max}")
        .replace("{min}", formatCurrency({ usd: 2000, eur: 2000, egp: 100000 }))
        .replace("{max}", formatCurrency({ usd: 3000, eur: 3000, egp: 150000 })),
      value: "2000_3000",
    },
    {
      label: t("search.budget4000_5000", "{min} - {max}")
        .replace("{min}", formatCurrency({ usd: 4000, eur: 4000, egp: 200000 }))
        .replace("{max}", formatCurrency({ usd: 5000, eur: 5000, egp: 250000 })),
      value: "4000_5000",
    },
    {
      label: t("search.budgetOver5000", "Over {amount}").replace(
        "{amount}",
        formatCurrency({ usd: 5000, eur: 5000, egp: 250000 })
      ),
      value: "over5000",
    },
  ], [t, formatCurrency]);

  const selectedBudgetOption = useMemo(
    () => budgetOptions.find((opt) => opt.value === budget),
    [budgetOptions, budget]
  );
  const budgetDisplayLabel = selectedBudgetOption ? selectedBudgetOption.label : budget;

  const tripTypeOptions = useMemo(() => [
    { label: t("search.tripTypeAll", "All"), value: "All" },
    { label: t("search.tripTypeGroup", "Group Tour"), value: "Group Tour" },
    { label: t("search.tripTypePrivate", "Private Tour"), value: "Private Tour" },
  ], [t]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("search", "true");
    if (date) params.append("date", date);
    if (destination) params.append("destination", destination);
    if (budget) params.append("budget", budgetDisplayLabel);
    if (tripType) params.append("tripType", tripType);
    
    router.push(`/egypttours?${params.toString()}`);
  };

  const renderTrigger = (icon: string, label: string, value: string, isOpen: boolean, setIsOpen: (o: boolean) => void) => (
    <button
      type="button"
      className={`${styles.filter} ${isOpen ? styles.filterActive : ""}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className={styles.icon}>
        <Image src={`/images/search/${icon}.svg`} alt="" width={20} height={20} />
      </span>
      <span className={`${styles.label} ${value ? styles.labelTruncated : ""}`}>{value || label}</span>
      <Image src="/images/arrows/arrow-down2-white.svg" alt="" width={12} height={12} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} />
    </button>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.active}`}>
          <Image src="/images/search/trips.svg" alt="" width={22.5} height={19.5} />
          <span>{t("search.tripsTab", "Trips")}</span>
        </button>
      </div>

      <GlassCard className={styles.searchBar}>
        <div className={styles.filterWrapper}>
          <CustomDatePicker
            value={date}
            onChange={setDate}
            dropdownClassName={styles.searchDropdown}
            variant="custom"
            renderTrigger={(isOpen, setIsOpen, displayTxt) => renderTrigger("calendar", t("search.date", "Date"), displayTxt, isOpen, setIsOpen)}
          />
        </div>

        <div className={styles.separator} aria-hidden />

        <div className={styles.filterWrapper}>
          <CheckboxDropdown
            options={destinationOptions}
            value={destination}
            onChange={setDestination}
            dropdownClassName={styles.searchDropdown}
            renderTrigger={(isOpen, setIsOpen) => renderTrigger("location", t("search.destination", "Destination"), destinationDisplayLabel, isOpen, setIsOpen)}
          />
        </div>

        <div className={styles.separator} aria-hidden />

        <div className={styles.filterWrapper}>
          <CheckboxDropdown
            options={budgetOptions}
            value={budget}
            onChange={setBudget}
            dropdownClassName={styles.searchDropdown}
            renderTrigger={(isOpen, setIsOpen) => renderTrigger("budget", t("search.budget", "Budget"), budgetDisplayLabel, isOpen, setIsOpen)}
          />
        </div>

        <div className={styles.separator} aria-hidden />

        <div className={styles.filterWrapper}>
          <CheckboxDropdown
            options={tripTypeOptions}
            value={tripType}
            onChange={setTripType}
            dropdownClassName={styles.searchDropdown}
            renderTrigger={(isOpen, setIsOpen) => renderTrigger("trip-type", t("search.tripType", "Trip Type"), tripType, isOpen, setIsOpen)}
          />
        </div>

        <button className={styles.searchBtn} onClick={handleSearch}>
          <Image src="/images/search/search.svg" alt="" width={18} height={18} />
          {t("search.search", "Search")}
        </button>
      </GlassCard>
    </div>
  );
}
