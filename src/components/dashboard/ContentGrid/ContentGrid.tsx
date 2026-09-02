"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import TablePanel from "@/components/dashboard/TablePanel/TablePanel";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import { LanguageTabs, type Language } from "@/components/shared";
import styles from "./ContentGrid.module.scss";

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  status: "Unpublished" | "Published";
  lastUpdated: string;
  rawTranslations?: any;
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
  searchQuery?: string;
  hasFilters?: boolean;
  onClearSearch?: () => void;
  loading?: boolean;
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
  searchQuery,
  hasFilters,
  onClearSearch,
  loading = false,
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
  const [activeLang, setActiveLang] = useState<Language>("English");

  const getLocalizedTitle = (item: ContentItem) => {
    if (activeLang === "Italian") return item.rawTranslations?.it?.title || item.rawTranslations?.it?.question || item.title;
    if (activeLang === "Spanish") return item.rawTranslations?.es?.title || item.rawTranslations?.es?.question || item.title;
    return item.title;
  };

  const getLocalizedContent = (item: ContentItem) => {
    let contentStr = item.content;
    if (activeLang === "Italian") contentStr = item.rawTranslations?.it?.content || item.rawTranslations?.it?.answer || item.content;
    if (activeLang === "Spanish") contentStr = item.rawTranslations?.es?.content || item.rawTranslations?.es?.answer || item.content;
    return contentStr;
  };

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

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        Loading content...
      </div>
    );
  }

  if (items.length === 0) {
    if (searchQuery) {
      return <DashboardSearchEmptyState onClearSearch={onClearSearch} />;
    }
    if (hasFilters) {
      return <DashboardFilterEmptyState onClearFilters={onClearSearch || (() => {})} />;
    }
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
        <div>
          <LanguageTabs active={activeLang} onChange={setActiveLang} />
        </div>
        <div className={styles.faqGrid}>
          {items.map((item, idx) => {
            const locTitle = getLocalizedTitle(item);
            return (
              <div key={item.id} className={styles.faqCard}>
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.questionSection}>
                    <div className={styles.numberBadge}>
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <h3 className={styles.questionText}>{locTitle}</h3>
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
                      __html: /<[a-z][\s\S]*>/i.test(getLocalizedContent(item))
                        ? getLocalizedContent(item)
                        : getLocalizedContent(item).split("\n\n").map((p: string) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("")
                    }}
                  />
                </div>

                {/* Card Footer */}
                <div className={styles.cardFooter}>
                  <span className={styles.lastUpdated}>Last Updated: {item.lastUpdated}</span>
                  <div
                    className={`${styles.statusBadge} ${item.status === "Published" ? styles.statusPublished : styles.statusUnpublished
                      }`}
                  >
                    {item.status}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </TablePanel>
    </>
  );
});

export default ContentGrid;
