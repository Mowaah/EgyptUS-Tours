"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { POLICY_TAB_ORDER, type PolicyId } from "./policyModalTypes";
import { PolicyModalBody } from "./PolicyModalBody";
import styles from "./ImportantLinksModal.module.scss";

const POLICY_META: Record<PolicyId, { tabLabel: string; subtitle: string }> = {
  terms: {
    tabLabel: "Terms & Conditions",
    subtitle: "Essential rules and guidelines for using our services and making reservations.",
  },
  children: {
    tabLabel: "Children Policy",
    subtitle: "Guidelines for accommodating children during your stay or trip.",
  },
  booking: {
    tabLabel: "Booking Policy",
    subtitle: "Important information about how reservations are confirmed and processed.",
  },
  tipping: {
    tabLabel: "Tipping",
    subtitle: "What you need to know about tipping customs in Egypt.",
  },
  cancellation: {
    tabLabel: "Cancellation Policy",
    subtitle: "Review our cancellation rules to avoid any unexpected charges.",
  },
};

interface ImportantLinksModalProps {
  open: boolean;
  initialTab: PolicyId;
  onClose: () => void;
}

export default function ImportantLinksModal({ open, initialTab, onClose }: ImportantLinksModalProps) {
  const [activeTab, setActiveTab] = useState<PolicyId>(initialTab);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted || !open) return null;

  const meta = POLICY_META[activeTab];

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.tabRow} role="tablist" aria-label="Policy sections">
          {POLICY_TAB_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              id={`policy-tab-${id}`}
              className={`${styles.tab} ${activeTab === id ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(id)}
            >
              {POLICY_META[id].tabLabel}
            </button>
          ))}
        </div>

        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <h2 id="policy-modal-title" className={styles.modalTitle}>
              {meta.tabLabel}
            </h2>
            <p className={styles.modalSubtitle}>{meta.subtitle}</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            <Image src="/images/x-modal.svg" alt="" width={24} height={24} />
          </button>
        </div>

        <hr className={styles.divider} />

        <div className={styles.body} role="tabpanel">
          <PolicyModalBody id={activeTab} />
        </div>
      </div>
    </div>,
    document.body
  );
}
