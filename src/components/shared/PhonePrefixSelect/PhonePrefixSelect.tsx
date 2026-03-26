"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./PhonePrefixSelect.module.scss";

const PHONE_CODES = [
  // Prioritized
  { code: "us", dial: "+1", name: "United States" },
  { code: "gb", dial: "+44", name: "United Kingdom" },
  { code: "au", dial: "+61", name: "Australia" },

  // North America
  { code: "ca", dial: "+1", name: "Canada" },
  { code: "mx", dial: "+52", name: "Mexico" },

  // Europe
  { code: "de", dial: "+49", name: "Germany" },
  { code: "fr", dial: "+33", name: "France" },
  { code: "it", dial: "+39", name: "Italy" },
  { code: "es", dial: "+34", name: "Spain" },
  { code: "nl", dial: "+31", name: "Netherlands" },
  { code: "pt", dial: "+351", name: "Portugal" },
  { code: "ch", dial: "+41", name: "Switzerland" },
  { code: "se", dial: "+46", name: "Sweden" },
  { code: "pl", dial: "+48", name: "Poland" },

  // Asia-Pacific
  { code: "cn", dial: "+86", name: "China" },
  { code: "jp", dial: "+81", name: "Japan" },
  { code: "kr", dial: "+82", name: "South Korea" },
  { code: "in", dial: "+91", name: "India" },
  { code: "nz", dial: "+64", name: "New Zealand" },
  { code: "sg", dial: "+65", name: "Singapore" },
  { code: "th", dial: "+66", name: "Thailand" },
  { code: "id", dial: "+62", name: "Indonesia" },
  { code: "ph", dial: "+63", name: "Philippines" },

  // Latin America
  { code: "br", dial: "+55", name: "Brazil" },
  { code: "ar", dial: "+54", name: "Argentina" },
  { code: "co", dial: "+57", name: "Colombia" },
  { code: "cl", dial: "+56", name: "Chile" },
  { code: "pe", dial: "+51", name: "Peru" },
  { code: "ve", dial: "+58", name: "Venezuela" },

  // Middle East & Africa
  { code: "sa", dial: "+966", name: "Saudi Arabia" },
  { code: "ae", dial: "+971", name: "UAE" },
  { code: "za", dial: "+27", name: "South Africa" },
  { code: "eg", dial: "+20", name: "Egypt" },
  { code: "ng", dial: "+234", name: "Nigeria" },
  { code: "ke", dial: "+254", name: "Kenya" },
  { code: "ma", dial: "+212", name: "Morocco" },
];

export default function PhonePrefixSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(PHONE_CODES[0]);
  const [typedChars, setTypedChars] = useState("");
  const typeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to auto-detect the user's country based on IP (great UX)
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.country_code) {
          const matchedCountry = PHONE_CODES.find(
            (c) => c.code.toLowerCase() === data.country_code.toLowerCase()
          );
          if (matchedCountry) {
            setSelected(matchedCountry);
          }
        }
      })
      .catch((err) => console.error("Could not auto-detect country code", err));
  }, []);

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
        if (!isOpen) {
          // Select it automatically behind the scenes like a native <select> does
          setSelected(PHONE_CODES[matchedIndex]);
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

  return (
    <div className={styles.wrapper} ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={`https://flagcdn.com/w40/${selected.code}.png`}
          alt={selected.code}
          className={styles.flag}
        />
        <span className={styles.dialSpan}>{selected.dial}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.scrollArea} ref={scrollAreaRef}>
            {PHONE_CODES.map((c, i) => (
              <button
                key={`${c.code}-${i}`}
                type="button"
                className={styles.option}
                onClick={() => { setSelected(c); setIsOpen(false); }}
              >
                <img
                  src={`https://flagcdn.com/w40/${c.code}.png`}
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
