"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.scss";
import { GlassCard, CheckboxDropdown, CustomDatePicker } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";

interface SearchBarProps {
  destinations?: { label: string; value: string }[];
}

export default function SearchBar({ destinations = [] }: SearchBarProps) {
  const { t } = useTranslation("home");
  const [date, setDate] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [tripType, setTripType] = useState("");
  const router = useRouter();

  const budgetOptions = useMemo(() => [
    { label: t("search.budgetLess1000", "less than 1,000$"), value: "less than 1,000$" },
    { label: t("search.budget1000_2000", "1,000£ - 2,000$"), value: "1,000£ - 2,000$" },
    { label: t("search.budget2000_3000", "2,000£ - 3,000$"), value: "2,000£ - 3,000$" },
    { label: t("search.budget4000_5000", "4,000£ - 5,000$"), value: "4,000£ - 5,000$" },
    { label: t("search.budgetOver5000", "Over 5,000$"), value: "Over 5,000$" },
  ], [t]);

  const tripTypeOptions = useMemo(() => [
    { label: t("search.tripTypeAll", "All"), value: "All" },
    { label: t("search.tripTypeGroup", "Group Tour"), value: "Group Tour" },
    { label: t("search.tripTypePrivate", "Private Tour"), value: "Private Tour" },
  ], [t]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (destination) params.append("destination", destination);
    if (budget) params.append("budget", budget);
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
            options={destinations}
            value={destination}
            onChange={setDestination}
            dropdownClassName={styles.searchDropdown}
            renderTrigger={(isOpen, setIsOpen) => renderTrigger("location", t("search.destination", "Destination"), destination, isOpen, setIsOpen)}
          />
        </div>

        <div className={styles.separator} aria-hidden />

        <div className={styles.filterWrapper}>
          <CheckboxDropdown
            options={budgetOptions}
            value={budget}
            onChange={setBudget}
            dropdownClassName={styles.searchDropdown}
            renderTrigger={(isOpen, setIsOpen) => renderTrigger("budget", t("search.budget", "Budget"), budget, isOpen, setIsOpen)}
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
