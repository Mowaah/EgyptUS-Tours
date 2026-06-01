import styles from "./SegmentedControl.module.scss";

export type DashboardRange = "Today" | "Week" | "Month";

const ranges: DashboardRange[] = ["Today", "Week", "Month"];

interface SegmentedControlProps {
  value: DashboardRange;
  onChange: (value: DashboardRange) => void;
}

export default function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  return (
    <div className={styles.segmented} aria-label="Date range">
      {ranges.map((range) => (
        <button
          type="button"
          className={range === value ? styles.segmentActive : ""}
          aria-pressed={range === value}
          onClick={() => onChange(range)}
          key={range}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
