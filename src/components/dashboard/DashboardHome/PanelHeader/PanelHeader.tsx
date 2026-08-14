import Image from "next/image";
import { SegmentedControl, type DashboardRange } from "../SegmentedControl";
import styles from "./PanelHeader.module.scss";

interface PanelHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: string;
  titleSuffix?: React.ReactNode;
  range?: DashboardRange;
  onRangeChange?: (range: DashboardRange) => void;
  actions?: React.ReactNode;
  className?: string;
}

export default function PanelHeader({
  icon,
  title,
  subtitle,
  badge,
  titleSuffix,
  range,
  onRangeChange,
  actions,
  className,
}: PanelHeaderProps) {
  const headerClassName = className ? `${styles.header} ${className}` : styles.header;

  return (
    <div className={headerClassName}>
      <span className={styles.icon} aria-hidden>
        <Image src={`/images/dashboard/${icon}.svg`} alt="" width={24} height={24} />
      </span>
      <div className={styles.titleContainer}>
        <div className={styles.titleRow}>
          <h2>{title}</h2>
          {badge ? <span className={styles.titleBadge}>{badge}</span> : null}
          {titleSuffix}
        </div>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {range && onRangeChange ? (
        <SegmentedControl value={range} onChange={onRangeChange} />
      ) : null}
      {actions && (
        <div className={styles.actions}>
          {actions}
        </div>
      )}
    </div>
  );
}
