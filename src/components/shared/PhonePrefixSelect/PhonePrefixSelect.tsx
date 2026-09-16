"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./PhonePrefixSelect.module.scss";

import { COUNTRIES, CountryInfo } from "@/data/countries";
import { extractDialAndNational, findCountry } from "@/utils/phoneUtils";

const PHONE_CODES = COUNTRIES;

interface PhonePrefixSelectProps {
  phoneValue?: string;
  onPhoneChange?: (val: string) => void;
  variant?: "default" | "ghost";
  error?: boolean;
  selectedCountryCode?: string;
}

export default function PhonePrefixSelect({
  phoneValue = "",
  onPhoneChange,
  variant = "default",
  error,
  selectedCountryCode,
}: PhonePrefixSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(() => {
    if (selectedCountryCode) {
      const found = findCountry(selectedCountryCode);
      if (found) return found;
    }
    return PHONE_CODES[0];
  });
  const [typedChars, setTypedChars] = useState("");
  const typeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to auto-detect the user's country based on IP 
    const detectCountry = async () => {
      let matchedCountry = PHONE_CODES[0]; // Default US
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          if (data.country_code) {
            const found = PHONE_CODES.find(
              (c) => c.code.toLowerCase() === data.country_code.toLowerCase()
            );
            if (found) {
              matchedCountry = found;
            }
          }
        }
      } catch (err) {
        // Ignore error and use default
      }
      
      if (!phoneValue && onPhoneChange) {
        setSelected(matchedCountry);
        onPhoneChange(`${matchedCountry.dial} `);
      }
    };

    detectCountry();
  }, []);

  useEffect(() => {
    if (selectedCountryCode) {
      const found = findCountry(selectedCountryCode);
      if (found && found.code !== selected.code) {
        setSelected(found);
        return;
      }
    }

    if (!phoneValue) return;

    const extracted = extractDialAndNational(phoneValue, selected.dial, selected.code);
    if (extracted.dial && extracted.dial !== selected.dial) {
      const found = findCountry(extracted.countryCode) || findCountry(extracted.dial);
      if (found) {
        setSelected(found);
      }
    }
  }, [phoneValue, selectedCountryCode, selected.dial, selected.code]);

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
    // Only capture single letter keys
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);

      const newChars = (typedChars + e.key).toLowerCase();
      setTypedChars(newChars);

      const matchedIndex = PHONE_CODES.findIndex(c => c.name.toLowerCase().startsWith(newChars));
      if (matchedIndex !== -1) {
        const newMatch = PHONE_CODES[matchedIndex];
        if (!isOpen) {
          setSelected(newMatch);
          if (onPhoneChange) {
            const extracted = extractDialAndNational(phoneValue, selected.dial, selected.code);
            const remainder = extracted.nationalNumber;
            onPhoneChange(`${newMatch.dial}${remainder ? ` ${remainder}` : " "}`);
          }
        } else {
          // If the menu is open, smoothly scroll down to it and focus it
          const matchedBtn = scrollAreaRef.current?.children[matchedIndex] as HTMLButtonElement;
          if (matchedBtn) {
            matchedBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
            matchedBtn.focus();
          }
        }
      }

      // Reset the buffer after 700ms of typing inactivity
      typeTimeoutRef.current = setTimeout(() => setTypedChars(""), 700);
    }
  };

  const triggerClass = `${styles.trigger} ${isOpen ? styles.open : ""} ${error ? styles.error : ""} ${variant === "ghost" ? styles.ghost : ""}`;
  const wrapperClass = `${styles.wrapper} ${variant === "ghost" ? styles.wrapperGhost : ""}`;

  return (
    <div className={wrapperClass} ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        className={triggerClass}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={`https://hatscripts.github.io/circle-flags/flags/${selected.code}.svg`}
          alt={selected.code}
          className={styles.flag}
        />
        <span className={styles.dialSpan}>{selected.dial}</span>
        <img
          src="/images/arrows/chevron-down2.svg"
          alt=""
          width={20}
          height={20}
          className={styles.chevron}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.scrollArea} ref={scrollAreaRef}>
            {PHONE_CODES.map((c, i) => (
              <button
                key={`${c.code}-${i}`}
                type="button"
                className={styles.option}
                onClick={() => {
                  setSelected(c);
                  setIsOpen(false);
                  if (onPhoneChange) {
                    const extracted = extractDialAndNational(phoneValue, selected.dial, selected.code);
                    const remainder = extracted.nationalNumber;
                    onPhoneChange(`${c.dial}${remainder ? ` ${remainder}` : " "}`);
                  }
                }}
              >
                <img
                  src={`https://hatscripts.github.io/circle-flags/flags/${c.code}.svg`}
                  alt={c.name}
                  className={styles.flag}
                />
                <span className={styles.dialOptionSpan}>{c.dial}</span>
                <span className={styles.nameOptionSpan}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
