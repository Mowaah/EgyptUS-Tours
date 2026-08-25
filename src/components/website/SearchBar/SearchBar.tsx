"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.scss";
import { GlassCard, CheckboxDropdown, CustomDatePicker } from "@/components/shared";

const BUDGET_OPTIONS = [
  { label: "less than 1,000$", value: "less than 1,000$" },
  { label: "1,000£ - 2,000$", value: "1,000£ - 2,000$" },
  { label: "2,000£ - 3,000$", value: "2,000£ - 3,000$" },
  { label: "4,000£ - 5,000$", value: "4,000£ - 5,000$" },
  { label: "Over 5,000$", value: "Over 5,000$" },
];

const TRIP_TYPE_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Group Tour", value: "Group Tour" },
  { label: "Private Tour", value: "Private Tour" },
];

interface SearchBarProps {
  destinations?: { label: string; value: string }[];
}

export default function SearchBar({ destinations = [] }: SearchBarProps) {
  const [date, setDate] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [tripType, setTripType] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (destination) params.append("destination", destination);
    if (budget) params.append("budget", budget);
    if (tripType) params.append("tripType", tripType);
    
    router.push(`/trips?${params.toString()}`);
  };

  const renderTrigger = (icon: string, label: string, value: string, isOpen: boolean, setIsOpen: (o: boolean) => void) => (
    <button className={styles.filter} onClick={() => setIsOpen(!isOpen)}>
      <span className={styles.icon}>
        <Image src={`/images/search/${icon}.svg`} alt="" width={18} height={18} />
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
          <span>trips</span>
        </button>
      </div>

      <GlassCard className={styles.searchBar}>
        <div className={styles.filterWrapper}>
          <CustomDatePicker
            value={date}
            onChange={setDate}
            dropdownClassName={styles.searchDropdown}
            variant="custom"
            renderTrigger={(isOpen, setIsOpen, displayTxt) => renderTrigger("calendar", "Date", displayTxt, isOpen, setIsOpen)}
          />
        </div>

        <div className={styles.separator} aria-hidden />

        <div className={styles.filterWrapper}>
          <CheckboxDropdown
            options={destinations}
            value={destination}
            onChange={setDestination}
            dropdownClassName={styles.searchDropdown}
            renderTrigger={(isOpen, setIsOpen) => renderTrigger("location", "Destination", destination, isOpen, setIsOpen)}
          />
        </div>

        <div className={styles.separator} aria-hidden />

        <div className={styles.filterWrapper}>
          <CheckboxDropdown
            options={BUDGET_OPTIONS}
            value={budget}
            onChange={setBudget}
            dropdownClassName={styles.searchDropdown}
            renderTrigger={(isOpen, setIsOpen) => renderTrigger("budget", "Budget", budget, isOpen, setIsOpen)}
          />
        </div>

        <div className={styles.separator} aria-hidden />

        <div className={styles.filterWrapper}>
          <CheckboxDropdown
            options={TRIP_TYPE_OPTIONS}
            value={tripType}
            onChange={setTripType}
            dropdownClassName={styles.searchDropdown}
            renderTrigger={(isOpen, setIsOpen) => renderTrigger("trip-type", "Trip Type", tripType, isOpen, setIsOpen)}
          />
        </div>

        <button className={styles.searchBtn} onClick={handleSearch}>
          <Image src="/images/search/search.svg" alt="" width={18} height={18} />
          Search
        </button>
      </GlassCard>
    </div>
  );
}
