"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./CustomDatePicker.module.scss";

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
  dropdownClassName?: string;
  variant?: "card" | "input" | "custom";
  renderTrigger?: (isOpen: boolean, setIsOpen: (o: boolean) => void, displayTxt: string) => React.ReactNode;
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M14.4299 5.92969L20.4999 11.9997L14.4299 18.0697" stroke="#D4D4D4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.01 12H20.33" stroke="#D4D4D4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 12H6.97" stroke="#D4D4D4" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const parseDateString = (val: string) => {
  if (!val) return new Date();

  // 1. Try standard Date parsing (works for "12/25/2024", etc)
  const d = new Date(val);
  if (!Number.isNaN(d.getTime())) return d;

  // 2. Fallback to exact split for MM/DD/YYYY
  const parts = val.split("/").map(Number);
  if (parts.length === 3 && parts.every(n => !Number.isNaN(n))) {
    return new Date(parts[2], parts[0] - 1, parts[1]);
  }

  // 3. Fallback to today if they are mid-typing invalid strings without crashing viewDate
  return new Date();
};

export default function CustomDatePicker({ value, onChange, className, dropdownClassName = "", variant = "card", renderTrigger }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initialDate = parseDateString(value);

  // ... rest remains same until the dropdown div renderer
  const [viewDate, setViewDate] = useState(initialDate);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    onChange(`${mm}/${dd}/${yyyy}`);
    setIsOpen(false);
  };

  const selectedDateObj = parseDateString(value);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const calendarGrid = [];

  // Add previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarGrid.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i)
    });
  }

  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarGrid.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    });
  }

  // Add next month leading days to complete the final week boundary
  const remaining = (7 - (calendarGrid.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    calendarGrid.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }

  const formattedMonthYear = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const formattedPickup = (() => {
    if (Number.isNaN(selectedDateObj.getTime())) return { main: "Select date", year: "" };

    return {
      main: selectedDateObj.toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }),
      year: selectedDateObj.getFullYear().toString(),
    };
  })();

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {variant === "input" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => {
            // 1. Strip out all letters/symbols 
            let raw = e.target.value.replace(/\D/g, "");
            if (raw.length > 8) raw = raw.slice(0, 8);

            // 2. Extract segments
            let mm = raw.slice(0, 2);
            let dd = raw.slice(2, 4);
            let yyyy = raw.slice(4, 8);

            // 3. Clamp Month to (01-12)
            if (mm.length === 1 && parseInt(mm) > 1) mm = `0${mm}`;
            if (mm.length === 2 && parseInt(mm) > 12) mm = "12";
            if (mm.length === 2 && parseInt(mm) === 0) mm = "01";

            // 4. Clamp Day to (01-31)
            if (dd.length === 1 && parseInt(dd) > 3) dd = `0${dd}`;
            if (dd.length === 2 && parseInt(dd) > 31) dd = "31";
            if (dd.length === 2 && parseInt(dd) === 0) dd = "01";

            // 5. Rebuild with slashes
            let formatted = mm;
            if (dd.length > 0) formatted += `/${dd}`;
            if (yyyy.length > 0) formatted += `/${yyyy}`;

            onChange(formatted);

            // Jump calendar if valid
            const parsed = new Date(formatted);
            if (!Number.isNaN(parsed.getTime()) && raw.length === 8) {
              setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
            }
          }}
          onClick={() => setIsOpen(true)}
          className={className}
          placeholder="mm/dd/yyyy"
        />
      ) : variant === "custom" && renderTrigger ? (
        renderTrigger(isOpen, setIsOpen, Number.isNaN(selectedDateObj.getTime()) ? "" : `${String(selectedDateObj.getDate()).padStart(2, '0')} - ${String(selectedDateObj.getMonth() + 1).padStart(2, '0')} - ${selectedDateObj.getFullYear()}`)
      ) : (
        <button
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.triggerActive : ""} ${className || ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={styles.dateValue}>
            <span className={styles.dateMain}>{formattedPickup.main}</span>
            {formattedPickup.year ? (
              <span className={styles.dateYear}>{formattedPickup.year}</span>
            ) : null}
          </div>
        </button>
      )}

      {isOpen && (
        <div className={`${styles.dropdown} ${dropdownClassName}`}>
          <div className={styles.header}>

            <button className={styles.navBtn} onClick={handlePrevMonth}>
              <ArrowIcon className={styles.flipIcon} />
            </button>
            <div className={styles.monthYear}>{formattedMonthYear}</div>
            <button className={styles.navBtn} onClick={handleNextMonth}>
              <ArrowIcon />
            </button>
          </div>

          <div className={styles.weekdays}>
            {WEEKDAYS.map((wd) => (
              <div key={wd} className={styles.weekdayName}>{wd}</div>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {calendarGrid.map((item, idx) => {
              const isSelected =
                item.date.getDate() === selectedDateObj.getDate() &&
                item.date.getMonth() === selectedDateObj.getMonth() &&
                item.date.getFullYear() === selectedDateObj.getFullYear();

              return (
                <button
                  key={idx}
                  onClick={() => handleDateSelect(item.date)}
                  className={`${styles.dayBtn} ${!item.isCurrentMonth ? styles.dayOutside : ""
                    } ${isSelected ? styles.daySelected : ""}`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
