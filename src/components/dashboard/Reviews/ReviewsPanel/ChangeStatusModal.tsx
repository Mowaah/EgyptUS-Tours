import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ModalHeader from "@/components/dashboard/shared/ModalHeader/ModalHeader";
import ModalFooter from "@/components/dashboard/shared/ModalFooter/ModalFooter";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import styles from "./ChangeStatusModal.module.scss";

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  onConfirm: (newStatus: string) => void;
}

export default function ChangeStatusModal({ isOpen, onClose, currentStatus, onConfirm }: ChangeStatusModalProps) {
  const [status, setStatus] = useState(currentStatus);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  if (!isOpen || !mounted) return null;

  const handleConfirm = () => {
    onConfirm(status);
    onClose();
  };

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Replied", value: "Replied" },
  ];

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true">
        <ModalHeader
          title="Change Status"
          subtitle="Change the current status of this item"
          iconSrc="/images/dashboard/convert.svg"
          onClose={onClose}
        />
        <div className={styles.content}>
          <DashboardField
            control="select"
            label="Status"
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
            options={statusOptions}
            variant="modal"
          />
        </div>
        <ModalFooter
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryLabel="Confirm"
          primaryOnClick={handleConfirm}
        />
      </div>
    </div>,
    document.body
  );
}
