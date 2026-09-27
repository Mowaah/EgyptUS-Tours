import Image from "next/image";
import { LoadingSpinner } from "@/components/shared";
import { formatDateDDMMYYYY } from "@/utils/dateFormat";
import styles from "./DashboardFooter.module.scss";

interface DashboardFooterProps {
  lastUpdateDate?: string;
  onDiscard?: () => void;
  onSave?: () => void;
  isSubmit?: boolean;
  hideActions?: boolean;
  isSaveDisabled?: boolean;
  isDiscardDisabled?: boolean;
  isSaving?: boolean;
  className?: string;
}

export function DashboardFooter({
  lastUpdateDate,
  onDiscard,
  onSave,
  isSubmit = false,
  hideActions = false,
  isSaveDisabled = false,
  isDiscardDisabled = false,
  isSaving = false,
  className = "",
}: DashboardFooterProps) {
  const formattedDate = lastUpdateDate ? formatDateDDMMYYYY(lastUpdateDate) || lastUpdateDate : "";

  return (
    <footer className={`${styles.actionBar} ${className}`}>
      {formattedDate ? (
        <p>
          Last Update: <strong>{formattedDate}</strong>
        </p>
      ) : (
        <div /> /* Empty div to keep flex alignment if no date */
      )}

      {!hideActions && (
        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.discardButton} 
            onClick={onDiscard}
            disabled={isDiscardDisabled || isSaving}
          >
            Discard
          </button>
          <button
            type={isSubmit ? "submit" : "button"}
            className={styles.saveButton}
            onClick={onSave}
            disabled={isSaveDisabled || isSaving}
          >
            {isSaving && (
              <LoadingSpinner size="sm" variant="inline" color="white" />
            )}
            Save Changes
            {!isSaving && (
              <Image
                src="/images/dashboard/save.svg"
                alt=""
                width={22}
                height={22}
                className={styles.buttonIcon}
              />
            )}
          </button>
        </div>
      )}
    </footer>
  );
}
