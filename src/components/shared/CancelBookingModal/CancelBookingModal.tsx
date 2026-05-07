"use client";

import Image from "next/image";
import styles from "./CancelBookingModal.module.scss";

interface CancelBookingModalProps {
  onKeepBooking: () => void;
  onConfirmCancel: () => void;
}

export default function CancelBookingModal({
  onKeepBooking,
  onConfirmCancel,
}: CancelBookingModalProps) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.iconWrap}>
            <Image src="/images/danger.svg" alt="" width={48} height={48} className={styles.icon} />
          </div>

          <div className={styles.text}>
            <h3>Are you sure you want to cancel?</h3>
            <p>You&apos;ll get a full refund - no charges applied.</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.keepButton} onClick={onKeepBooking}>
            Keep Booking
          </button>
          <button type="button" className={styles.confirmButton} onClick={onConfirmCancel}>
            Yes, Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}
