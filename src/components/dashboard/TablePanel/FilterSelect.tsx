"use client";

import { useEffect, useRef, useState } from "react";
import CheckboxIndicator from "@/components/shared/CheckboxIndicator/CheckboxIndicator";
import styles from "./TablePanel.module.scss";

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function FilterSelect({ id, label, value, options, onChange }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={`${styles.filterField} ${open ? styles.filterFieldOpen : ""}`} ref={ref}>
      {/* Pill */}
      <div
        role="button"
        tabIndex={0}
        className={styles.filterPill}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Filter by ${label}`}
        id={`filter-${id}`}
      >
        {/* Left: label */}
        <span className={styles.filterPillLabel}>{label}</span>
        {/* Right: current value + chevron */}
        <span className={styles.filterPillValue}>{value}</span>
        <span className={styles.filterPillChevron} aria-hidden>
          <svg viewBox="0 0 10 6" fill="none" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 1 5 5 9 1" />
          </svg>
        </span>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className={styles.filterDropdown} role="listbox" aria-labelledby={`filter-${id}`}>
          <div className={styles.filterDropdownItems}>
            {options.map((option) => {
              const selected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`${styles.filterDropdownItem} ${selected ? styles.filterDropdownItemSelected : ""}`}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <div className={styles.filterDropdownItemInner}>
                    <CheckboxIndicator selected={selected} variant="square" size="md" style={{ width: 18, height: 18 }} />
                    <span className={styles.filterOptionText}>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
