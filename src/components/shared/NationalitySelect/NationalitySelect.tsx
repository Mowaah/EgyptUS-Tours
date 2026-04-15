"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./NationalitySelect.module.scss";
import { COUNTRIES } from "@/data/countries";

interface NationalitySelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
  useCountryName?: boolean;
}

export default function NationalitySelect({ value, onChange, error, useCountryName = false }: NationalitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [typedChars, setTypedChars] = useState("");
  const typeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter out any duplicate codes and sort by name
  const sortedCountries = [...COUNTRIES].sort((a, b) => {
    const labelA = useCountryName ? a.name : (a.nationality || a.name);
    const labelB = useCountryName ? b.name : (b.nationality || b.name);
    return labelA.localeCompare(labelB);
  });
  
  const selected = sortedCountries.find(c => c.nationality === value || c.name === value || c.code === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }

    // Capture single letter keys for searching
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);

      const newChars = (typedChars + e.key).toLowerCase();
      setTypedChars(newChars);

      const matchedIndex = sortedCountries.findIndex(c => {
        const label = useCountryName ? c.name : (c.nationality || c.name);
        return label.toLowerCase().startsWith(newChars);
      });

      if (matchedIndex !== -1) {
        if (!isOpen) {
          // If closed, just update the selection
          const matched = sortedCountries[matchedIndex];
          onChange(useCountryName ? matched.name : (matched.nationality || matched.name));
        } else {
          // If open, scroll to the button
          const matchedBtn = scrollAreaRef.current?.children[matchedIndex] as HTMLButtonElement;
          if (matchedBtn) {
            matchedBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
            matchedBtn.focus();
          }
        }
      }

      typeTimeoutRef.current = setTimeout(() => setTypedChars(""), 700);
    }
  };

  return (
    <div className={styles.wrapper} ref={containerRef} onKeyDown={handleKeyDown}>
      <button 
        type="button" 
        className={`${styles.trigger} ${isOpen ? styles.open : ""} ${error ? styles.error : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selected ? (
          <div className={styles.selectedRow}>
            <img src={`https://hatscripts.github.io/circle-flags/flags/${selected.code}.svg`} alt={useCountryName ? selected.name : (selected.nationality || selected.name)} className={styles.flag} />
            <span>{useCountryName ? selected.name : (selected.nationality || selected.name)}</span>
          </div>
        ) : (
          <span className={styles.placeholder}>{useCountryName ? "Select Country" : "Select Your Nationality"}</span>
        )}
        <svg className={styles.chevron} width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.scrollArea} ref={scrollAreaRef} role="listbox">
            {sortedCountries.map(c => {
              const label = useCountryName ? c.name : (c.nationality || c.name);
              return (
                <button 
                  key={c.code} 
                  type="button" 
                  className={styles.option} 
                  role="option"
                  aria-selected={value === label}
                  onClick={() => { 
                    onChange(label); 
                    setIsOpen(false); 
                  }}
                >
                  <img src={`https://hatscripts.github.io/circle-flags/flags/${c.code}.svg`} alt={label} className={styles.flag} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
