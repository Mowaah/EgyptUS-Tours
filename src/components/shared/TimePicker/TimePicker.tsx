"use client";

import { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Picker, { PickerValue } from "react-mobile-picker";
import styles from "./TimePicker.module.scss";

// ── Infinite-loop data (module-level — built once) ────────────────────────────
// Strategy: use unique index-based keys ("h-0" … "h-59") so the library's
// findIndex() always hits the exact slot we want, avoiding position jumps.
// 5 repetitions → ~2 full rotations of buffer on each side.

const H_REPS = 5;   // 5 × 12 =  60 hour entries
const MS_REPS = 5;   // 5 × 60 = 300 minute / second entries

const HOUR_KEYS = Array.from({ length: H_REPS * 12 }, (_, i) => `h-${i}`);
const MIN_KEYS = Array.from({ length: MS_REPS * 60 }, (_, i) => `m-${i}`);

// Midpoints — where the picker starts (the center repetition)
const MID_H = Math.floor(H_REPS / 2) * 12;  // 24  (indices 24–35 = hours 1–12)
const MID_M = Math.floor(MS_REPS / 2) * 60;  // 120 (indices 120–179 = minutes 0–59)

// Display value from key
const hourLabel = (k: string) => String((parseInt(k.slice(2)) % 12) + 1).padStart(2, "0");
const minLabel = (k: string) => String(parseInt(k.slice(2)) % 60).padStart(2, "0");

// Mid-range key for a given logical value
const midHKey = (h: number) => `h-${MID_H + (h - 1)}`;   // h ∈ 1..12
const midMKey = (m: number) => `m-${MID_M + m}`;

// Extract logical value from a key
const hourFromKey = (k: string) => (parseInt(k.slice(2)) % 12) + 1;  // 1..12
const minFromKey = (k: string) => parseInt(k.slice(2)) % 60;

// Picker sizing — matches the dropdown's inner height (240px − 2×10px padding = 220px)
const PICKER_H = 220; // px
const ITEM_H = 73;  // px  (≈ 220 / 3 → 3 visible rows)

// ── Public types ──────────────────────────────────────────────────────────────
export interface TimeValue {
  hour: number;          // 1-12
  minute: number;          // 0-59
  period: "AM" | "PM";
}

interface TimePickerProps {
  value?: TimeValue | string;
  onChange?: (v: TimeValue, str: string) => void;
  variant?: "inline" | "input";
  className?: string;
  dropdownClassName?: string;
  placeholder?: string;
}

// Internal picker state (string keys understood by react-mobile-picker)
interface DrumState extends PickerValue {
  hour: string;
  minute: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TimePicker({ 
  value, 
  onChange, 
  variant = "inline",
  className,
  dropdownClassName,
  placeholder = "HH : MM  AM/PM" 
}: TimePickerProps) {
  const parseTime = (val?: TimeValue | string): TimeValue => {
    if (!val) return { hour: 6, minute: 0, period: "PM" };
    if (typeof val !== "string") return val;
    const match = val.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
    if (match) {
      return {
        hour: parseInt(match[1]) || 12,
        minute: parseInt(match[2]) || 0,
        period: (match[3]?.toUpperCase() as "AM" | "PM") ?? "AM",
      };
    }
    return { hour: 12, minute: 0, period: "AM" };
  };

  const tv = parseTime(value);

  const [drum, setDrum] = useState<DrumState>({
    hour: midHKey(tv.hour),
    minute: midMKey(tv.minute),
  });
  const [period, setPeriod] = useState<"AM" | "PM">(tv.period);
  
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>();

  useEffect(() => {
    if (variant === "inline") return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [variant]);

  useLayoutEffect(() => {
    if (variant === "inline" || !open || !containerRef.current) return;
    const updatePos = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 1300,
      });
    };
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [variant, open]);

  // Sync external value → internal state, but ONLY when the displayed value
  // actually differs (prevents resetting position while the user is scrolling).
  useEffect(() => {
    setDrum((prev) => {
      const same =
        hourFromKey(prev.hour) === tv.hour &&
        minFromKey(prev.minute) === tv.minute;
      if (same) return prev;
      return {
        hour: midHKey(tv.hour),
        minute: midMKey(tv.minute),
      };
    });
    setPeriod((prev) => (prev !== tv.period ? tv.period : prev));
  }, [tv.hour, tv.minute, tv.period]);

  const handleDrumChange = useCallback(
    (newDrum: DrumState) => {
      setDrum(newDrum);
      if (onChange) {
        const h = hourFromKey(newDrum.hour);
        const m = minFromKey(newDrum.minute);
        const hStr = String(h).padStart(2, "0");
        const mStr = String(m).padStart(2, "0");
        onChange({ hour: h, minute: m, period }, `${hStr}:${mStr} ${period}`);
      }
    },
    [onChange, period]
  );

  const handlePeriod = useCallback(
    (p: "AM" | "PM") => {
      setPeriod(p);
      if (onChange) {
        const h = hourFromKey(drum.hour);
        const m = minFromKey(drum.minute);
        const hStr = String(h).padStart(2, "0");
        const mStr = String(m).padStart(2, "0");
        onChange({ hour: h, minute: m, period: p }, `${hStr}:${mStr} ${p}`);
      }
    },
    [drum, onChange]
  );

  const displayValue = value ? `${String(tv.hour).padStart(2, "0")}:${String(tv.minute).padStart(2, "0")} ${tv.period}` : "";

  const pickerContent = (
    <div className={`${styles.dropdown} ${dropdownClassName || ""}`} style={variant === "input" ? dropdownStyle : undefined} ref={dropdownRef}>
      {/* Full-width selection lines (overlay the library's own gray lines) */}
      <div className={styles.selectionHighlight} />

      {/* ── Library drum: Hours : Minutes : Seconds ── */}
      <Picker<DrumState>
        value={drum}
        onChange={handleDrumChange}
        wheelMode="natural"
        height={PICKER_H}
        itemHeight={ITEM_H}
        className={styles.picker}
      >
        <Picker.Column name="hour" className={styles.column}>
          {HOUR_KEYS.map((key) => (
            <Picker.Item key={key} value={key} className={styles.item}>
              {({ selected }) => (
                <span className={selected ? styles.rowSelected : styles.rowFaded}>
                  {hourLabel(key)}
                </span>
              )}
            </Picker.Item>
          ))}
        </Picker.Column>

        <span className={styles.separator}>:</span>

        <Picker.Column name="minute" className={styles.column}>
          {MIN_KEYS.map((key) => (
            <Picker.Item key={key} value={key} className={styles.item}>
              {({ selected }) => (
                <span className={selected ? styles.rowSelected : styles.rowFaded}>
                  {minLabel(key)}
                </span>
              )}
            </Picker.Item>
          ))}
        </Picker.Column>
      </Picker>

      {/* ── AM / PM toggle (kept as custom buttons — matches original design) ── */}
      <div className={styles.ampmColumn}>
        {(["AM", "PM"] as const).map((p) => (
          <button
            key={p}
            type="button"
            className={`${styles.ampmBtn} ${period === p ? styles.ampmSelected : styles.ampmUnselected
              }`}
            onClick={(e) => {
              e.preventDefault();
              handlePeriod(p);
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );

  if (variant === "input") {
    return (
      <div ref={containerRef} style={{ width: "100%", position: "relative" }}>
        <input
          type="text"
          readOnly
          className={className}
          value={displayValue}
          placeholder={placeholder}
          onClick={() => setOpen((o) => !o)}
          style={{ cursor: "pointer", width: "100%" }}
        />
        {open && dropdownStyle && createPortal(pickerContent, document.body)}
      </div>
    );
  }

  return pickerContent;
}
