"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CURRENCY_OPTIONS, DisplayCurrencyCode, useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/i18n/types";

import styles from "./TopBar.module.scss";

const HIDE_TOPBAR_PREFIX = "/booking";

type DropdownOption = {
  code: string;
  name?: string;
  icon?: string;
  symbol?: string;
  value?: string;
};

interface SimpleDropdownProps {
  options: DropdownOption[];
  value: DropdownOption;
  onChange: (val: DropdownOption) => void;
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

  const selectedValue = value.code;
  const activeOption = options.find(opt => (opt.code || opt.value) === selectedValue) ?? options[0];

  return (
    <div className={`${styles.dropdownWrapper} ${className || ""}`} ref={containerRef}>
      <button
        type="button"
        className={`${styles.dropdownToggle} ${type === "lang" ? styles.langToggle : styles.currToggle} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {type === "lang" ? (
          <>
            <Image src={activeOption.icon || ""} alt={activeOption.name || activeOption.code} width={16} height={16} className={styles.flagIcon} />
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
                        <path d="M1 5L4 8L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                )}

                {type === "lang" && (
                  <Image src={opt.icon || ""} alt="" width={16} height={16} className={styles.miniFlag} />
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
  const { setLanguage, activeOption: activeLang } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const activeCurr = CURRENCY_OPTIONS.find((option) => option.code === currency) ?? CURRENCY_OPTIONS[0];

  if (pathname === HIDE_TOPBAR_PREFIX || pathname.startsWith(`${HIDE_TOPBAR_PREFIX}/`)) {
    return null;
  }

  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div className={styles.socials}>
          <a href="#" aria-label="Facebook" className={styles.socialIcon}>
            <Image src="/images/footer/facebook.svg" alt="Facebook" width={12.6} height={12.6} />
          </a>
          <a href="#" aria-label="Instagram" className={styles.socialIcon}>
            <Image src="/images/footer/instagram.svg" alt="Instagram" width={12} height={12} />
          </a>
          <a href="#" aria-label="Tiktok" className={styles.socialIcon}>
            <Image src="/images/footer/tiktok.svg" alt="Tiktok" width={12} height={12} />
          </a>
        </div>

        <div className={styles.settings}>
          <SimpleDropdown
            options={SUPPORTED_LANGUAGES}
            value={activeLang}
            onChange={(option) => {
              const nextLang = SUPPORTED_LANGUAGES.find((lang) => lang.code === option.code);
              if (nextLang) setLanguage(nextLang.locale);
            }}
            type="lang"
          />
          <SimpleDropdown
            options={CURRENCY_OPTIONS}
            value={activeCurr}
            onChange={(option) => setCurrency(option.code as DisplayCurrencyCode)}
            type="curr"
          />
        </div>
      </div>
    </div>
  );
}
