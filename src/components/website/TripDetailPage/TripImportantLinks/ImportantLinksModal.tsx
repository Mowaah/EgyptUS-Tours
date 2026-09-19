"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import type { PolicyId } from "./policyModalTypes";
import { fetchLegalTabs, type LegalTab } from "./legalTabs";
import { LoadingSpinner } from "@/components/shared";
import styles from "./ImportantLinksModal.module.scss";

interface ImportantLinksModalProps {
  open: boolean;
  initialTab?: PolicyId;
  initialTabKey?: string;
  onClose: () => void;
}

export default function ImportantLinksModal({
  open,
  initialTab = "terms",
  initialTabKey,
  onClose,
}: ImportantLinksModalProps) {
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

    fetchLegalTabs(language)
      .then((allTabs) => {
        if (cancelled) return;

        setTabs(allTabs);

        if (allTabs.length > 0) {
          const matchingKey = initialTabKey
            ? allTabs.find((tab) => tab.key === initialTabKey)?.key
            : undefined;

          if (matchingKey) {
            setActiveKey(matchingKey);
          } else if (initialTab === "cancellation") {
            const cancellationTab = allTabs.find((tab) => {
              const lowerLabel = tab.label.toLowerCase();
              const lowerKey = tab.key.toLowerCase();
              return (
                lowerLabel.includes("cancel") ||
                lowerLabel.includes("cancell") ||
                lowerLabel.includes("إلغاء") ||
                lowerKey.includes("cancel")
              );
            });
            const firstTerms = allTabs.find((tab) => tab.key.startsWith("terms-"));
            setActiveKey(cancellationTab ? cancellationTab.key : (firstTerms ? firstTerms.key : allTabs[0].key));
          } else if (initialTab === "privacy" || initialTab === "booking" || initialTab === "children") {
            const firstPrivacy = allTabs.find((tab) => tab.key.startsWith("privacy-"));
            setActiveKey(firstPrivacy ? firstPrivacy.key : allTabs[0].key);
          } else {
            const firstTerms = allTabs.find((tab) => tab.key.startsWith("terms-"));
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
  }, [open, language, initialTab, initialTabKey]);

  // Scroll active tab into view when active tab changes
  useEffect(() => {
    if (!activeKey) return;
    const activeBtn = document.getElementById(`policy-tab-${activeKey}`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeKey]);

  // Close on Escape with capture phase to avoid closing parent modals
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
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
    <div
      className={styles.overlay}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      role="presentation"
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — section title + close button */}
        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <h2 id="policy-modal-title" className={styles.modalTitle}>
              {loading
                ? "\u00A0"
                : activeTab?.label ?? t("noContent", "No content available")}
            </h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            <Image src="/images/x-modal.svg" alt="" width={20} height={20} />
          </button>
        </div>

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

        {(loading || tabs.length === 0) && <hr className={styles.divider} />}

        {/* Content */}
        <div className={styles.body} role="tabpanel" aria-labelledby={`policy-tab-${activeKey}`}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <LoadingSpinner size="md" label="" />
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
