import Image from "next/image";
import styles from "./ExportButtons.module.scss";

export interface ExportButtonsProps {
  onCsvClick?: () => void;
}

export default function ExportButtons({ onCsvClick }: ExportButtonsProps) {
  return (
    <div className={styles.container}>
      <button type="button" className={styles.btn} onClick={onCsvClick}>
        <span className={styles.icon}>
          <Image src="/images/dashboard/export.svg" alt="" width={20} height={20} />
        </span>
        CSV
      </button>
    </div>
  );
}
