import Image from "next/image";
import styles from "./DashboardNavbar.module.scss";

interface DashboardFilterButtonProps {
  onClick?: () => void;
  isOpen?: boolean;
  hasActiveFilter?: boolean;
  label?: string;
}

export default function DashboardFilterButton({
  onClick,
  isOpen = false,
  hasActiveFilter = false,
  label = "Filter dashboard results",
}: DashboardFilterButtonProps) {
  return (
    <button
      className={`${styles.filterButton} ${isOpen ? styles.active : ""} ${hasActiveFilter ? styles.hasFilter : ""}`.trim()}
      type="button"
      aria-label={label}
      aria-expanded={onClick ? isOpen : undefined}
      aria-pressed={hasActiveFilter}
      onClick={onClick}
    >
      <Image
        src="/images/dashboard/navbar/filter.svg"
        alt=""
        width={24}
        height={24}
        className={styles.actionIcon}
        aria-hidden
      />
    </button>
  );
}
