import Image from "next/image";
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
  return (
    <footer className={`${styles.actionBar} ${className}`}>
      {lastUpdateDate ? (
        <p>
          Last Update: <strong>{lastUpdateDate}</strong>
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
              <span className={styles.loadingSpinner} aria-hidden="true" style={{ marginRight: '8px' }} />
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
