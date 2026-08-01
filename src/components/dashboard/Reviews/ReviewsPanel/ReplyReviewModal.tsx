import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ModalHeader from "@/components/dashboard/shared/ModalHeader/ModalHeader";
import ModalFooter from "@/components/dashboard/shared/ModalFooter/ModalFooter";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import styles from "./ChangeStatusModal.module.scss";

interface ReplyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string | number;
  customerName: string;
  onConfirm: (replyText: string) => void;
}

export default function ReplyReviewModal({ isOpen, onClose, reviewId, customerName, onConfirm }: ReplyReviewModalProps) {
  const [replyText, setReplyText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setReplyText("");
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleConfirm = () => {
    if (replyText.trim()) {
      onConfirm(replyText);
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true" style={{ maxWidth: '500px' }}>
        <ModalHeader
          title={`Reply to ${customerName}`}
          subtitle="Write a response to this user review."
          iconSrc="/images/dashboard/reply.svg"
          onClose={onClose}
        />
        <div className={styles.content}>
          <DashboardField
            control="textarea"
            label="Your Reply"
            placeholder="Thank you for your feedback..."
            value={replyText}
            onChange={(e: any) => setReplyText(e.target.value)}
            variant="modal"
          />
        </div>
        <ModalFooter
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryLabel="Send Reply"
          primaryOnClick={handleConfirm}
        />
      </div>
    </div>,
    document.body
  );
}
