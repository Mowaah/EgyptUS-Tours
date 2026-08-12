import React, { useState } from "react";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import styles from "./RequestModals.module.scss";

interface CancelTripModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function CancelTripModal({ open, onClose, onSubmit }: CancelTripModalProps) {
  const [reason, setReason] = useState("");

  React.useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} style={{ width: "600px" }} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Cancel Trip"
          iconSrc="/images/dashboard/requests/footer/cancel-trip.svg"
          onClose={onClose}
        />
        <div className={styles.body}>
          <DashboardField
            label="Cancellation Reason"
            control="textarea"
            variant="modal"
            id="cancel_reason"
            placeholder="Describe the reason for cancelling this trip..."
            rows={6}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <ModalFooter
          secondaryLabel="Cancel"
          primaryLabel="Cancel Trip"
          secondaryOnClick={onClose}
          primaryOnClick={() => onSubmit(reason)}
          primaryDisabled={!reason.trim()}
          isDanger={true}
        />
      </div>
    </div>
  );
}
