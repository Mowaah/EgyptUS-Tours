import styles from "./PriceRangeFilter.module.scss";

interface PriceRangeFilterProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (newMin: number, newMax: number) => void;
  step?: number;
  formatValue?: (value: number) => string;
}

export default function PriceRangeFilter({ min, max, valueMin, valueMax, onChange, step = 1, formatValue }: PriceRangeFilterProps) {
  const rangeWidth = max - min;
  
  // Calculate percentage positions for the filled track
  const leftPercent = rangeWidth > 0 ? Math.max(0, Math.min(100, ((valueMin - min) / rangeWidth) * 100)) : 0;
  const widthPercent = rangeWidth > 0 ? Math.max(0, Math.min(100 - leftPercent, ((valueMax - valueMin) / rangeWidth) * 100)) : 100;

  return (
    <div className={styles.priceRange}>
      <div className={styles.rangeContainer}>
        <div className={styles.rangeTrack} />
        <div
          className={styles.rangeTrackFill}
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), valueMax - step);
            onChange(val, valueMax);
          }}
          className={`${styles.rangeInput} ${valueMin > max - 100 ? styles.minThumbOver : ""}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), valueMin + step);
            onChange(valueMin, val);
          }}
          className={styles.rangeInput}
        />
      </div>
      <span className={styles.rangeLabel}>
        {formatValue ? `${formatValue(valueMin)} - ${formatValue(valueMax)}` : `$${valueMin} - $${valueMax}`}
      </span>
    </div>
  );
}
