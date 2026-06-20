"use client";

import { useState } from "react";
import ReviewSummaryGrid from "./ReviewSummaryGrid";
import { ReviewsPanel } from "./ReviewsPanel";
import AddTestimonialModal from "./ReviewsPanel/AddTestimonialModal";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import DashboardTabs from "@/components/shared/DashboardTabs/DashboardTabs";
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
      <DashboardTabs 
        tabs={[
          { id: "user-reviews", label: "User Reviews" },
          { id: "admin-testimonials", label: "Admin Testimonials" }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel="Reviews sections"
      />

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
