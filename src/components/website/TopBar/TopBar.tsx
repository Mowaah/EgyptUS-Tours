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

export default function TopBar() {
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [activeCurr, setActiveCurr] = useState(CURRENCIES[0]);
  
  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false);
      }
      if (currRef.current && !currRef.current.contains(target)) {
        setCurrOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === HIDE_TOPBAR_PREFIX || pathname.startsWith(`${HIDE_TOPBAR_PREFIX}/`)) {
    return null;
  }

  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div className={styles.socials}>
          <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>
            <Image src="/images/linkedin.svg" alt="LinkedIn" width={14} height={14} />
          </a>
          <a href="#" aria-label="Facebook" className={styles.socialIcon}>
            <Image src="/images/facebook.svg" alt="Facebook" width={16} height={16} />
          </a>
          <a href="#" aria-label="X" className={styles.socialIcon}>
            <Image src="/images/x.svg" alt="X" width={14} height={14} />
          </a>
        </div>

        <div className={styles.settings}>
          {/* Language Dropdown */}
          <div className={`${styles.dropdownWrapper} ${styles.langWrapper}`} ref={langRef}>
            <button 
              className={`${styles.dropdownToggle} ${styles.langToggle} ${langOpen ? styles.open : ""}`}
              onClick={() => { setLangOpen(o => !o); setCurrOpen(false); }}
            >
              <Image src={activeLang.icon} alt={activeLang.name} width={20} height={20} className={styles.flagIcon} />
              <span>{activeLang.code}</span>
              <Image src="/images/arrow-down2-white.svg" alt="" width={12} height={12} className={styles.chevron} />
            </button>
            {langOpen && (
              <div className={styles.dropdownMenu}>
                {LANGUAGES.map((lang) => {
                  const isSelected = lang.code === activeLang.code;
                  return (
                    <button
                      key={lang.code}
                      className={`${styles.menuItem} ${isSelected ? styles.menuItemSelected : ""}`}
                      onClick={() => { setActiveLang(lang); setLangOpen(false); }}
                    >
                      <Image src={lang.icon} alt="" width={22} height={22} className={styles.flagIcon} />
                      <span className={styles.menuItemText}>{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Currency Dropdown */}
          <div className={`${styles.dropdownWrapper} ${styles.currWrapper}`} ref={currRef}>
            <button 
              className={`${styles.dropdownToggle} ${styles.currToggle} ${currOpen ? styles.open : ""}`}
              onClick={() => { setCurrOpen(o => !o); setLangOpen(false); }}
            >
              <span>{activeCurr.code} ({activeCurr.symbol})</span>
              <Image src="/images/arrow-down2-white.svg" alt="" width={12} height={12} className={styles.chevron} />
            </button>
            {currOpen && (
              <div className={styles.dropdownMenu}>
                {CURRENCIES.map((curr) => {
                  const isSelected = curr.code === activeCurr.code;
                  return (
                    <button
                      key={curr.code}
                      className={`${styles.menuItem} ${isSelected ? styles.menuItemSelected : ""}`}
                      onClick={() => { setActiveCurr(curr); setCurrOpen(false); }}
                    >
                      <span className={isSelected ? styles.radioSelected : styles.radioEmpty} />
                      <span className={styles.menuItemText}>{curr.code} ({curr.symbol})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
