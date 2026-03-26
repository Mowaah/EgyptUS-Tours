"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./CountrySelect.module.scss";

// Fast, zero-dependency robust array covering major targets. 
// Can be substituted with a 240+ ISO array later!
const COUNTRIES = [
  { code: "us", name: "United States" },
  { code: "it", name: "Italy" },
  { code: "es", name: "Spain" },
  { code: "eg", name: "Egypt" },
  { code: "de", name: "Germany" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "br", name: "Brazil" },
  { code: "cn", name: "China" },
  { code: "fr", name: "France" },
  { code: "in", name: "India" },
  { code: "jp", name: "Japan" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "za", name: "South Africa" },
  { code: "ae", name: "United Arab Emirates" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function CountrySelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<typeof COUNTRIES[0] | null>(null);
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

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button 
        type="button" 
        className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? (
          <div className={styles.selectedRow}>
            {/* Using FlagCDN - free, ultra-reliable global CDN for country flags */}
            <img src={`https://flagcdn.com/w40/${selected.code}.png`} alt={selected.name} className={styles.flag} />
            <span>{selected.name}</span>
          </div>
        ) : (
          <span className={styles.placeholder}>Select Country</span>
        )}
        <svg className={styles.chevron} width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.scrollArea}>
            {COUNTRIES.map(c => (
              <button key={c.code} type="button" className={styles.option} onClick={() => { setSelected(c); setIsOpen(false); }}>
                <img src={`https://flagcdn.com/w40/${c.code}.png`} alt={c.name} className={styles.flag} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
