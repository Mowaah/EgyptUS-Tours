import Image from "next/image";
import styles from "./ExportButtons.module.scss";

export interface ExportButtonsProps {
  onCsvClick?: () => void;
  onPdfClick?: () => void;
}

export default function ExportButtons({ onCsvClick, onPdfClick }: ExportButtonsProps) {
  return (
    <div className={styles.container}>
      <button type="button" className={styles.btn} onClick={onCsvClick}>
        <span className={styles.icon}>
          {/* using export2 as fallback for CSV export icon */}
          <Image src="/images/dashboard/export.svg" alt="" width={20} height={20} />
        </span>
        CSV
      </button>
      
      <button type="button" className={styles.btn} onClick={onPdfClick}>
        <span className={styles.icon}>
          {/* using export as fallback for stickynote icon */}
          <Image src="/images/dashboard/pdf.svg" alt="" width={20} height={20} />
        </span>
        PDF
      </button>
    </div>
  );
}
