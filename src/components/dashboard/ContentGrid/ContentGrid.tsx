"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import TablePanel from "@/components/dashboard/TablePanel/TablePanel";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
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
  onViewItem: (item: ContentItem, index: number) => void;
  onEditItem: (item: ContentItem) => void;
  onPublishItem: (item: ContentItem) => void;
  onUnpublishItem: (item: ContentItem) => void;
  onDeleteItem: (item: ContentItem) => void;
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
  emptyStateActionLabel = "Add New",
  onViewItem,
  onEditItem,
  onPublishItem,
  onUnpublishItem,
  onDeleteItem,
}, ref) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [isBannerVisible, setIsBannerVisible] = useState(false);
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



  const showBanner = (message: string, variant: "success" | "warning" = "success") => {
    setBannerMessage(message);
    setBannerVariant(variant);
    // Setting it to false first ensures the banner re-triggers if called multiple times quickly
    setIsBannerVisible(false);
    setTimeout(() => setIsBannerVisible(true), 10);
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
          <DashboardStatusBanner
            show={isBannerVisible}
            onClose={() => setIsBannerVisible(false)}
            message={bannerMessage}
            variant={bannerVariant}
            className={styles.bannerOverride}
            durationMs={4300}
          />
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
                          onViewItem(item, idx + 1);
                        }}
                      >
                        <span className={styles.actionIcon} style={{ maskImage: `url(/images/dashboard/view.svg)`, WebkitMaskImage: `url(/images/dashboard/view.svg)` }} aria-hidden />
                        <span>View</span>
                      </button>

                      <button
                        className={styles.menuAction}
                        onClick={() => {
                          setOpenDropdownId(null);
                          onEditItem(item);
                        }}
                      >
                        <span className={styles.actionIcon} style={{ maskImage: `url(/images/dashboard/edit.svg)`, WebkitMaskImage: `url(/images/dashboard/edit.svg)` }} aria-hidden />
                        <span>Edit</span>
                      </button>

                      {item.status === "Published" ? (
                        <button className={styles.menuActionUnpublish} onClick={() => {
                          setOpenDropdownId(null);
                          onUnpublishItem(item);
                        }}>
                          <span className={styles.actionIcon} style={{ maskImage: `url(/images/dashboard/unpublish.svg)`, WebkitMaskImage: `url(/images/dashboard/unpublish.svg)` }} aria-hidden />
                          <span>Unpublish</span>
                        </button>
                      ) : (
                        <button className={styles.menuActionPublish} onClick={() => {
                          setOpenDropdownId(null);
                          onPublishItem(item);
                        }}>
                          <span className={styles.actionIcon} style={{ maskImage: `url(/images/dashboard/publish.svg)`, WebkitMaskImage: `url(/images/dashboard/publish.svg)` }} aria-hidden />
                          <span>Publish</span>
                        </button>
                      )}

                      <button
                        className={styles.menuActionDanger}
                        onClick={() => {
                          setOpenDropdownId(null);
                          onDeleteItem(item);
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
                <div 
                  className={`${styles.answerText} tiptap-content`}
                  dangerouslySetInnerHTML={{ 
                    __html: /<[a-z][\s\S]*>/i.test(item.content) 
                      ? item.content 
                      : item.content.split("\n\n").map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("") 
                  }} 
                />
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
    </>
  );
});

export default ContentGrid;
