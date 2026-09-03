"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import type { PolicyId } from "./policyModalTypes";
import { getTerms, getPrivacy, type LegalSectionData } from "@/services/legalHelpService";
import styles from "./ImportantLinksModal.module.scss";

interface ImportantLinksModalProps {
  open: boolean;
  initialTab?: PolicyId;
  onClose: () => void;
}

/** Flat tab built from a backend section */
interface LegalTab {
  key: string; // unique key e.g. "terms-1"
  label: string;
  content: string;
}

export default function ImportantLinksModal({ open, initialTab = "terms", onClose }: ImportantLinksModalProps) {
  const { t, language } = useTranslation("legal");

  const [tabs, setTabs] = useState<LegalTab[]>([]);
  const [activeKey, setActiveKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Fetch all sections whenever the modal opens or language changes
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setTabs([]);
    setActiveKey("");

    Promise.all([getTerms(language), getPrivacy(language)])
      .then(([termsData, privacyData]) => {
        if (cancelled) return;

        const termsTabs: LegalTab[] = termsData.map((s: LegalSectionData) => ({
          key: `terms-${s.id}`,
          label: s.title,
          content: s.content,
        }));

        const privacyTabs: LegalTab[] = privacyData.map((s: LegalSectionData) => ({
          key: `privacy-${s.id}`,
          label: s.title,
          content: s.content,
        }));

        const allTabs = [...termsTabs, ...privacyTabs];
        setTabs(allTabs);

        // Pick initial active tab based on initialTab hint
        if (allTabs.length > 0) {
          if (initialTab === "privacy" || initialTab === "booking" || initialTab === "children") {
            // Try to open first privacy tab
            const firstPrivacy = privacyTabs[0];
            setActiveKey(firstPrivacy ? firstPrivacy.key : allTabs[0].key);
          } else {
            // Default: first terms tab
            const firstTerms = termsTabs[0];
            setActiveKey(firstTerms ? firstTerms.key : allTabs[0].key);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load legal content:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, language, initialTab]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted || !open) return null;

  const activeTab = tabs.find((t) => t.key === activeKey);

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tab row — each backend section is a tab */}
        {!loading && tabs.length > 0 && (
          <div className={styles.tabRow} role="tablist" aria-label="Legal sections">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeKey === tab.key}
                id={`policy-tab-${tab.key}`}
                className={`${styles.tab} ${activeKey === tab.key ? styles.tabActive : ""}`}
                onClick={() => setActiveKey(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Header — just the active section title, no subtitle */}
        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <h2 id="policy-modal-title" className={styles.modalTitle}>
              {loading
                ? t("loading", "Loading...")
                : activeTab?.label ?? t("noContent", "No content available")}
            </h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            <Image src="/images/x-modal.svg" alt="" width={24} height={24} />
          </button>
        </div>

        <hr className={styles.divider} />

        {/* Content */}
        <div className={styles.body} role="tabpanel" aria-labelledby={`policy-tab-${activeKey}`}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <p>{t("loading", "Loading...")}</p>
            </div>
          ) : !activeTab ? (
            <div className={styles.emptyState}>
              <p>{t("noContent", "No content available at the moment.")}</p>
            </div>
          ) : (
            <div
              className={styles.richTextContent}
              dangerouslySetInnerHTML={{ __html: activeTab.content }}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
