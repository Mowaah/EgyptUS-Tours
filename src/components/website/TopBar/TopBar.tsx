"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CheckboxDropdown from "@/components/shared/CheckboxDropdown/CheckboxDropdown";

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
          <div className={`${styles.dropdownWrapper} ${styles.langWrapper}`}>
            <CheckboxDropdown
              options={LANGUAGES.map(l => ({ ...l, label: l.name, value: l.code }))}
              value={activeLang.code}
              onChange={(val) => setActiveLang(LANGUAGES.find(l => l.code === val) || LANGUAGES[0])}
              dropdownClassName={styles.dropdownMenu}
              checkboxStyle="none"
              renderTrigger={(isOpen, setIsOpen) => (
                <button
                  className={`${styles.dropdownToggle} ${styles.langToggle} ${isOpen ? styles.open : ""}`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Image src={activeLang.icon} alt={activeLang.name} width={20} height={20} className={styles.flagIcon} />
                  <span>{activeLang.code}</span>
                  <Image src="/images/arrows/arrow-down2-white.svg" alt="" width={12} height={12} className={styles.chevron} />
                </button>
              )}
              renderOption={(opt) => (
                <>
                  <Image src={opt.icon as string} alt="" width={22} height={22} className={styles.flagIcon} />
                  <span className={styles.menuItemText}>{opt.name as string}</span>
                </>
              )}
            />
          </div>

          {/* Currency Dropdown */}
          <div className={`${styles.dropdownWrapper} ${styles.currWrapper}`}>
            <CheckboxDropdown
              options={CURRENCIES.map(c => ({ ...c, label: c.code, value: c.code }))}
              value={activeCurr.code}
              onChange={(val) => setActiveCurr(CURRENCIES.find(c => c.code === val) || CURRENCIES[0])}
              dropdownClassName={styles.dropdownMenu}
              checkboxStyle="radio"
              renderTrigger={(isOpen, setIsOpen) => (
                <button
                  className={`${styles.dropdownToggle} ${styles.currToggle} ${isOpen ? styles.open : ""}`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span>{activeCurr.code} ({activeCurr.symbol})</span>
                  <Image src="/images/arrows/arrow-down2-white.svg" alt="" width={12} height={12} className={styles.chevron} />
                </button>
              )}
              renderOption={(opt) => (
                <span className={styles.menuItemText}>{opt.code as string} ({opt.symbol as string})</span>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
