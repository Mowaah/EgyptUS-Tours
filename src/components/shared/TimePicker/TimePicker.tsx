"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import styles from "./TimePicker.module.scss";

// ── Helpers ────────────────────────────────────────────────────────────────────
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

// ── Column component ───────────────────────────────────────────────────────────
interface DrumColumnProps {
  value: number;
  min: number;
  max: number; // inclusive
  onChange: (v: number) => void;
}

function DrumColumn({ value, min, max, onChange }: DrumColumnProps) {
  const range = max - min + 1;
  const prev = min + mod(value - min - 1, range);
  const next = min + mod(value - min + 1, range);
  const colRef = useRef<HTMLDivElement>(null);

  // ── Mouse wheel — must be non-passive to preventDefault ──
  const wheelDelta = useRef(0);

  useEffect(() => {
    const el = colRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      wheelDelta.current += e.deltaY;
      const steps = Math.trunc(wheelDelta.current / 40);
      if (steps !== 0) {
        wheelDelta.current -= steps * 40;
        onChange(min + mod(value - min + steps, range));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [value, min, range, onChange]);

  // ── Touch drag ──
  const touchStartY = useRef<number | null>(null);
  const touchAccum = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchAccum.current = 0;
  };

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current === null) return;
      const dy = touchStartY.current - e.touches[0].clientY;
      touchAccum.current += dy;
      touchStartY.current = e.touches[0].clientY;
      const steps = Math.trunc(touchAccum.current / 40);
      if (steps !== 0) {
        touchAccum.current -= steps * 40;
        onChange(min + mod(value - min + steps, range));
      }
    },
    [value, min, range, onChange]
  );

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  return (
    <div
      ref={colRef}
      className={styles.column}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`${styles.row} ${styles.rowFaded}`}
        onClick={() => onChange(prev)}
      >
        {pad(prev)}
      </div>

      <div className={`${styles.row} ${styles.rowSelected}`}>
        {pad(value)}
      </div>

      <div
        className={`${styles.row} ${styles.rowFaded}`}
        onClick={() => onChange(next)}
      >
        {pad(next)}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export interface TimeValue {
  hour: number;   // 1-12
  minute: number; // 0-59
  second: number; // 0-59
  period: "AM" | "PM";
}

interface TimePickerProps {
  value?: TimeValue;
  onChange?: (v: TimeValue) => void;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [time, setTime] = useState<TimeValue>(
    value ?? { hour: 6, minute: 28, second: 55, period: "PM" }
  );

  const update = useCallback(
    (patch: Partial<TimeValue>) => {
      const next = { ...time, ...patch };
      setTime(next);
      onChange?.(next);
    },
    [time, onChange]
  );

  return (
    <div className={styles.dropdown}>
      {/* Full-width selection lines — span across drum AND AM/PM column */}
      <div className={styles.selectionLineTop} />
      <div className={styles.selectionLineBottom} />

      {/* ── Left: Hours : Minutes : Seconds ── */}
      <div className={styles.drum}>

        <DrumColumn
          value={time.hour}
          min={1}
          max={12}
          onChange={(v) => update({ hour: v })}
        />

        <span className={styles.separator}>:</span>

        <DrumColumn
          value={time.minute}
          min={0}
          max={59}
          onChange={(v) => update({ minute: v })}
        />

        <span className={styles.separator}>:</span>

        <DrumColumn
          value={time.second}
          min={0}
          max={59}
          onChange={(v) => update({ second: v })}
        />
      </div>

      {/* ── Right: AM / PM ── */}
      <div className={styles.ampmColumn}>
        {(["AM", "PM"] as const).map((p) => (
          <button
            key={p}
            type="button"
            className={`${styles.ampmBtn} ${
              time.period === p ? styles.ampmSelected : styles.ampmUnselected
            }`}
            onClick={() => update({ period: p })}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
