"use client";

import { useState } from "react";
import ReviewSummaryGrid from "./ReviewSummaryGrid";
import { ReviewsPanel } from "./ReviewsPanel";
import AddTestimonialModal from "./ReviewsPanel/AddTestimonialModal";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import reviewsPanelStyles from "./ReviewsPanel/ReviewsPanel.module.scss";
import styles from "./Reviews.module.scss";

type ReviewTab = "user-reviews" | "admin-testimonials";

interface ReviewsProps {
  searchQuery?: string;
  isAddModalOpen?: boolean;
  onAddModalClose?: () => void;
  onClearSearch?: () => void;
}

export default function Reviews({ searchQuery = "", isAddModalOpen = false, onAddModalClose, onClearSearch }: ReviewsProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("user-reviews");
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.tabCard}>
        <div className={styles.tabs} role="tablist" aria-label="Reviews sections">
          <button
            role="tab"
            type="button"
            id="tab-user-reviews"
            aria-controls="panel-user-reviews"
            aria-selected={activeTab === "user-reviews"}
            className={`${styles.tab} ${activeTab === "user-reviews" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("user-reviews")}
          >
            User Reviews
          </button>
          <button
            role="tab"
            type="button"
            id="tab-admin-testimonials"
            aria-controls="panel-admin-testimonials"
            aria-selected={activeTab === "admin-testimonials"}
            className={`${styles.tab} ${activeTab === "admin-testimonials" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("admin-testimonials")}
          >
            Admin Testimonials
          </button>
        </div>
      </div>

      {activeTab === "user-reviews" && (
        <div
          role="tabpanel"
          id="panel-user-reviews"
          aria-labelledby="tab-user-reviews"
          className={styles.tabPanel}
        >
          <ReviewSummaryGrid />
          <ReviewsPanel searchQuery={searchQuery} onClearSearch={onClearSearch} />
        </div>
      )}

      {activeTab === "admin-testimonials" && (
        <div
          role="tabpanel"
          id="panel-admin-testimonials"
          aria-labelledby="tab-admin-testimonials"
          className={styles.tabPanel}
        >
          <ReviewSummaryGrid type="admin" />
          <ReviewsPanel searchQuery={searchQuery} type="admin" onClearSearch={onClearSearch} />
        </div>
      )}

      <AddTestimonialModal 
        isOpen={isAddModalOpen} 
        onClose={() => onAddModalClose?.()} 
        onSubmit={(data) => {
          // TODO: call your API here, e.g. await api.createTestimonial(data)
          console.log("[Add Testimonial] Submitting:", data);
          onAddModalClose?.();
          setIsAddBannerOpen(true);
        }}
      />
      <DashboardStatusBanner
        show={isAddBannerOpen}
        onClose={() => setIsAddBannerOpen(false)}
        message="The new testimonial has been added successfully"
        variant="success"
        className={reviewsPanelStyles.toastBanner} 
      />
    </div>
  );
}
