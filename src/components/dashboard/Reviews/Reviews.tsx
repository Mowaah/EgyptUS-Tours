"use client";

import { useState } from "react";
import ReviewSummaryGrid from "./ReviewSummaryGrid";
import { ReviewsPanel } from "./ReviewsPanel";
import AddTestimonialModal from "./ReviewsPanel/AddTestimonialModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";
import { createAdminTestimonial } from "@/services/admin/adminReviewsService";
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
          <ReviewSummaryGrid type="user" refreshTrigger={refreshTrigger} />
          <ReviewsPanel 
            searchQuery={searchQuery} 
            onClearSearch={onClearSearch} 
            type="user" 
            refreshTrigger={refreshTrigger}
            onDataChange={() => setRefreshTrigger(prev => prev + 1)}
          />
        </div>
      )}

      {activeTab === "admin-testimonials" && (
        <div
          role="tabpanel"
          id="panel-admin-testimonials"
          aria-labelledby="tab-admin-testimonials"
          className={styles.tabPanel}
        >
          <ReviewSummaryGrid type="admin" refreshTrigger={refreshTrigger} />
          <ReviewsPanel 
            searchQuery={searchQuery} 
            type="admin" 
            onClearSearch={onClearSearch} 
            refreshTrigger={refreshTrigger}
            onDataChange={() => setRefreshTrigger(prev => prev + 1)}
          />
        </div>
      )}

      <AddTestimonialModal 
        isOpen={isAddModalOpen} 
        onClose={() => onAddModalClose?.()} 
        onSubmit={async (data) => {
          try {
            await createAdminTestimonial({
              customer_name: data.customer,
              country: data.country,
              category: data.category.toLowerCase() as any,
              rating: Number(data.rating),
              title: data.title,
              description: data.description,
              video_url: data.videoUrl || "",
              status: data.published ? "published" : "draft",
            });
            onAddModalClose?.();
            setIsAddBannerOpen(true);
            setRefreshTrigger(prev => prev + 1);
          } catch (error) {
            console.error("Failed to create testimonial:", error);
          }
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
