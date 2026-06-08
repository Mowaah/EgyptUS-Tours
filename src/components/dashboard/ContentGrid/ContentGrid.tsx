"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import TablePanel from "@/components/dashboard/TablePanel/TablePanel";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import DashboardConfirmationModal from "@/components/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import FaqViewModal from "@/components/dashboard/FaqViewModal/FaqViewModal";
import FaqFormModal from "@/components/dashboard/FaqFormModal/FaqFormModal";
import styles from "./ContentGrid.module.scss";

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  status: "Draft" | "Published";
  lastUpdated: string;
}

export interface ContentGridProps {
  title: string;
  ariaLabel: string;
  iconSrc?: string;
  items: ContentItem[];
  onAdd?: () => void;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateActionLabel?: string;
}

export interface ContentGridRef {
  showBanner: (message: string, variant?: "success" | "warning") => void;
}

const ContentGrid = forwardRef<ContentGridRef, ContentGridProps>(({ 
  title, 
  ariaLabel, 
  iconSrc, 
  items, 
  onAdd,
  emptyStateTitle = "No items yet",
  emptyStateSubtitle = "Get started by creating your first item.",
  emptyStateActionLabel = "Add New"
}, ref) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<{ index: number; title: string; content: string } | null>(null);
  const [editItem, setEditItem] = useState<{ id: string; title: string; content: string; status: "Published" | "Draft" } | null>(null);
  const [editSuccessOpen, setEditSuccessOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);

  const [bannerState, setBannerState] = useState<"hidden" | "visible" | "leaving">("hidden");
  const [bannerTick, setBannerTick] = useState(0);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerVariant, setBannerVariant] = useState<"success" | "warning">("success");

  useEffect(() => {
    if (openDropdownId === null) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.menuWrapper}`)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [openDropdownId]);

  useEffect(() => {
    if (bannerState === "hidden") return;
    const leaveTimer = setTimeout(() => setBannerState("leaving"), 4000);
    const hiddenTimer = setTimeout(() => setBannerState("hidden"), 4300);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hiddenTimer);
    };
  }, [bannerTick, bannerState]);

  const showBanner = (message: string, variant: "success" | "warning" = "success") => {
    setBannerMessage(message);
    setBannerVariant(variant);
    setBannerState("visible");
    setBannerTick((c) => c + 1);
    setOpenDropdownId(null);
  };

  useImperativeHandle(ref, () => ({
    showBanner,
  }));

  if (items.length === 0) {
    return (
      <DashboardEmptyState
        title={emptyStateTitle}
        subtitle={emptyStateSubtitle}
        actionLabel={emptyStateActionLabel}
        onAction={onAdd}
      />
    );
  }

  return (
    <>
      <TablePanel
        ariaLabel={ariaLabel}
        title={title}
        iconSrc={iconSrc}
        headerActions={
          bannerState !== "hidden" ? (
            <DashboardStatusBanner
              message={bannerMessage}
              leaving={bannerState === "leaving"}
              variant={bannerVariant}
              className={styles.bannerOverride}
            />
          ) : null
        }
      >
        <div className={styles.faqGrid}>
          {items.map((item, idx) => (
            <div key={item.id} className={styles.faqCard}>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div className={styles.questionSection}>
                  <div className={styles.numberBadge}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className={styles.questionText}>{item.title}</h3>
                </div>

                {/* Dropdown */}
                <div className={styles.menuWrapper}>
                  <button
                    type="button"
                    className={`${styles.moreButton} ${openDropdownId === item.id ? styles.moreButtonActive : ""}`}
                    aria-expanded={openDropdownId === item.id}
                    aria-label="More options"
                    onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                  >
                    <span className={styles.dotsIcon} aria-hidden />
                  </button>

                  {openDropdownId === item.id && (
                    <div className={styles.rowMenu}>
                      <button
                        className={styles.menuAction}
                        onClick={() => {
                          setOpenDropdownId(null);
                          setViewItem({ index: idx + 1, title: item.title, content: item.content });
                        }}
                      >
                        <span className={styles.actionIcon} style={{ maskImage: `url(/images/dashboard/view.svg)`, WebkitMaskImage: `url(/images/dashboard/view.svg)` }} aria-hidden />
                        <span>View</span>
                      </button>

                      <button
                        className={styles.menuAction}
                        onClick={() => {
                          setOpenDropdownId(null);
                          setEditItem({ id: item.id, title: item.title, content: item.content, status: item.status });
                        }}
                      >
                        <span className={styles.actionIcon} style={{ maskImage: `url(/images/dashboard/edit.svg)`, WebkitMaskImage: `url(/images/dashboard/edit.svg)` }} aria-hidden />
                        <span>Edit</span>
                      </button>

                      {item.status === "Published" ? (
                        <button className={styles.menuActionUnpublish} onClick={() => showBanner("The question has been unpublished successfully and is no longer visible to users on the platform.", "warning")}>
                          <span className={styles.actionIcon} style={{ maskImage: `url(/images/dashboard/unpublish.svg)`, WebkitMaskImage: `url(/images/dashboard/unpublish.svg)` }} aria-hidden />
                          <span>Unpublish</span>
                        </button>
                      ) : (
                        <button className={styles.menuActionPublish} onClick={() => showBanner("The question has been published successfully")}>
                          <span className={styles.actionIcon} style={{ maskImage: `url(/images/dashboard/publish.svg)`, WebkitMaskImage: `url(/images/dashboard/publish.svg)` }} aria-hidden />
                          <span>Publish</span>
                        </button>
                      )}

                      <button
                        className={styles.menuActionDanger}
                        onClick={() => {
                          setOpenDropdownId(null);
                          setDeleteItem(item.id);
                        }}
                      >
                        <span className={styles.actionIcon} style={{ maskImage: `url(/images/dashboard/delete.svg)`, WebkitMaskImage: `url(/images/dashboard/delete.svg)` }} aria-hidden />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <p className={styles.answerText}>{item.content}</p>
              </div>

              {/* Card Footer */}
              <div className={styles.cardFooter}>
                <span className={styles.lastUpdated}>Last Updated: {item.lastUpdated}</span>
                <div
                  className={`${styles.statusBadge} ${
                    item.status === "Published" ? styles.statusPublished : styles.statusDraft
                  }`}
                >
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </TablePanel>

      <FaqViewModal
        open={viewItem !== null}
        index={viewItem?.index ?? 1}
        title={viewItem?.title ?? ""}
        content={viewItem?.content ?? ""}
        onClose={() => setViewItem(null)}
        onEdit={() => {
          if (viewItem) {
            const item = items[viewItem.index - 1];
            setEditItem({ id: item.id, title: item.title, content: item.content, status: item.status });
          }
          setViewItem(null);
        }}
      />

      <FaqFormModal
        open={editItem !== null}
        mode="edit"
        initialData={editItem ? { question: editItem.title, answer: editItem.content, status: editItem.status } : undefined}
        onClose={() => setEditItem(null)}
        onSave={() => {
          setEditItem(null);
          setEditSuccessOpen(true);
        }}
      />

      {editSuccessOpen && (
        <SuccessModal
          title="Changes Published Successfully"
          message="Your edits have been successfully published and are now live on the website for visitors to see."
          primaryButtonText="View live"
          hideSecondaryButton
          onPrimaryClick={() => setEditSuccessOpen(false)}
          onClose={() => setEditSuccessOpen(false)}
        />
      )}

      <DashboardConfirmationModal
        open={deleteItem !== null}
        variant="delete"
        title="Delete FAQ Item"
        message="Are you sure you want to remove this FAQ from the website? This action cannot be undone and the question will no longer appear to users."
        cancelLabel="Back"
        confirmLabel="Delete"
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          setDeleteItem(null);
          showBanner("The question has been deleted successfully");
        }}
      />
    </>
  );
});

export default ContentGrid;
