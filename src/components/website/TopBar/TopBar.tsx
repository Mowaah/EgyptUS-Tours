"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import styles from "./TopBar.module.scss";

const HIDE_TOPBAR_PREFIX = "/booking";

const LANGUAGES = [
  { code: "EN", name: "English", icon: "/images/en.svg" },
  { code: "IT", name: "Italian", icon: "/images/it.svg" },
  { code: "ES", name: "Spanish", icon: "/images/es.svg" },
];

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
];

interface SimpleDropdownProps {
  options: any[];
  value: any;
  onChange: (val: any) => void;
  className?: string;
  type?: "lang" | "curr";
}

function SimpleDropdown({ options, value, onChange, className, type }: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const selectedValue = value.code || value;
  const activeOption = options.find(opt => (opt.code || opt.value) === selectedValue);

  return (
    <div className={`${styles.dropdownWrapper} ${className || ""}`} ref={containerRef}>
      <button
        type="button"
        className={`${styles.dropdownToggle} ${type === "lang" ? styles.langToggle : styles.currToggle} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {type === "lang" ? (
          <>
            <Image src={activeOption.icon} alt={activeOption.name} width={16} height={16} className={styles.flagIcon} />
            <span>{activeOption.code}</span>
          </>
        ) : (
          <span>{activeOption.code} ({activeOption.symbol})</span>
        )}
        <Image src="/images/arrows/arrow-down3.svg" alt="" width={14} height={14} className={styles.chevron} />
      </button>

      {isOpen && (
        <div className={`${styles.customMenu} ${type === "lang" ? styles.menuLang : styles.menuCurr}`}>
          {options.map((opt, idx) => {
            const isSelected = (opt.code || opt.value) === selectedValue;
            return (
              <button
                key={idx}
                type="button"
                className={`${styles.menuItem} ${isSelected ? styles.selected : ""}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {type === "curr" && (
                  <div className={`${styles.simpleCheckbox} ${isSelected ? styles.checked : ""}`}>
                    {isSelected && (
                      <svg width="6" height="6" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M1 5L4 8L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                )}
                
                {type === "lang" && (
                  <Image src={opt.icon} alt="" width={16} height={16} className={styles.miniFlag} />
                )}
                
                <span className={styles.menuText}>{type === "lang" ? opt.name : `${opt.code} (${opt.symbol})`}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TopBar() {
  const pathname = usePathname();
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [activeCurr, setActiveCurr] = useState(CURRENCIES[0]);

  if (pathname === HIDE_TOPBAR_PREFIX || pathname.startsWith(`${HIDE_TOPBAR_PREFIX}/`)) {
    return null;
  }

  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div className={styles.socials}>
          <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>
            <Image src="/images/linkedin.svg" alt="LinkedIn" width={9.67} height={9.67} />
          </a>
          <a href="#" aria-label="Facebook" className={styles.socialIcon}>
            <Image src="/images/facebook.svg" alt="Facebook" width={12.6} height={12.6} />
          </a>
          <a href="#" aria-label="X" className={styles.socialIcon}>
            <Image src="/images/x.svg" alt="X" width={9.78} height={10} />
          </a>
        </div>

        <div className={styles.settings}>
          <SimpleDropdown
            options={LANGUAGES}
            value={activeLang}
            onChange={setActiveLang}
            type="lang"
          />
          <SimpleDropdown
            options={CURRENCIES}
            value={activeCurr}
            onChange={setActiveCurr}
            type="curr"
          />
        </div>
      </div>
    </div>
  );
}
