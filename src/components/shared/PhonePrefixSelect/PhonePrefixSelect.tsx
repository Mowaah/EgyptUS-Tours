"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./PhonePrefixSelect.module.scss";

import { COUNTRIES } from "@/data/countries";

const PHONE_CODES = COUNTRIES;

interface PhonePrefixSelectProps {
  phoneValue?: string;
  onPhoneChange?: (val: string) => void;
  variant?: "default" | "ghost";
}

export default function PhonePrefixSelect({ phoneValue = "", onPhoneChange, variant = "default" }: PhonePrefixSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(PHONE_CODES[0]);
  const [typedChars, setTypedChars] = useState("");
  const typeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to auto-detect the user's country based on IP 
    const detectCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) return;

        const data = await res.json();
        if (data.country_code) {
          const matchedCountry = PHONE_CODES.find(
            (c) => c.code.toLowerCase() === data.country_code.toLowerCase()
          );
          if (matchedCountry && !phoneValue) {
            setSelected(matchedCountry);
            if (onPhoneChange) onPhoneChange(`${matchedCountry.dial} `);
          }
        }
      } catch (err) {
      }
    };

    detectCountry();
  }, []);

  useEffect(() => {
    if (!phoneValue) return;

    const match = [...PHONE_CODES]
      .sort((a, b) => b.dial.length - a.dial.length)
      .find(c => phoneValue.startsWith(c.dial));

    if (match && match.code !== selected.code) {
      setSelected(match);
    }
  }, [phoneValue, selected.code]);

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
          const newMatch = PHONE_CODES[matchedIndex];
          setSelected(newMatch);
          if (onPhoneChange) {
            const currentPrefix = [...PHONE_CODES]
              .sort((a, b) => b.dial.length - a.dial.length)
              .find(code => phoneValue.startsWith(code.dial));

            if (currentPrefix) {
              onPhoneChange(phoneValue.replace(currentPrefix.dial, newMatch.dial));
            } else {
              onPhoneChange(`${newMatch.dial} ${phoneValue}`);
            }
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

  const triggerClass = `${styles.trigger} ${isOpen ? styles.open : ""} ${variant === "ghost" ? styles.ghost : ""}`;
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
                    const currentPrefix = [...PHONE_CODES]
                      .sort((a, b) => b.dial.length - a.dial.length)
                      .find(code => phoneValue.startsWith(code.dial));

                    if (currentPrefix) {
                      onPhoneChange(phoneValue.replace(currentPrefix.dial, c.dial));
                    } else {
                      // Keep whatever letters they typed, just prepend the dial code
                      onPhoneChange(`${c.dial} ${phoneValue}`);
                    }
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
