import Image from "next/image";
import SegmentedControl, { type DashboardRange } from "./SegmentedControl";
import { iconPath } from "./utils";
import styles from "./DashboardHome.module.scss";

interface PanelHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: string;
  range?: DashboardRange;
  onRangeChange?: (range: DashboardRange) => void;
}

export default function PanelHeader({ icon, title, subtitle, badge, range, onRangeChange }: PanelHeaderProps) {
  return (
    <div className={styles.panelHeader}>
      <span className={styles.panelIcon} aria-hidden>
        <Image src={iconPath(icon)} alt="" width={24} height={24} />
      </span>
      <div className={styles.titleContainer}>
        <div className={styles.titleRow}>
          <h2>{title}</h2>
          {badge && <span className={styles.titleBadge}>{badge}</span>}
        </div>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {range && onRangeChange ? <SegmentedControl value={range} onChange={onRangeChange} /> : null}
    </div>
  );
}
