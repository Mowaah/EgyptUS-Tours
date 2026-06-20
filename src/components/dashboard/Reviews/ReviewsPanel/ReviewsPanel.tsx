"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import { mockReviews, mockAdminTestimonials } from "../reviewsData";
import { reviewsColumns, reviewRowActions, adminTestimonialsColumns, adminTestimonialRowActions } from "./reviewsColumns";
import ViewReviewModal from "./ViewReviewModal";
import ChangeStatusModal from "./ChangeStatusModal";
import AddTestimonialModal from "./AddTestimonialModal";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import DashboardConfirmationModal from "@/components/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import styles from "./ReviewsPanel.module.scss";

const filterOptions = {
  category: ["All", "Trips", "Transportation", "Hotels"],
  rating: ["All", "5 stars", "4 stars", "3 stars", "2 stars", "1 star"],
  state: ["All", "Pending", "Replied"],
  date: ["All", "Mar 15, 2024", "Mar 14, 2024"],
};

interface ReviewsPanelProps {
  searchQuery?: string;
  type?: "user" | "admin";
  onClearSearch?: () => void;
  title?: string;
  iconSrc?: string;
  hideCustomerColumn?: boolean;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
}

export function ReviewsPanel({
  searchQuery = "",
  type = "user",
  onClearSearch,
  title: customTitle,
  iconSrc: customIconSrc,
  hideCustomerColumn,
  emptyStateTitle,
  emptyStateSubtitle,
}: ReviewsPanelProps) {
  const defaultFilters = {
    category: "All",
    rating: "All",
    state: "All",
    date: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isStatusBannerOpen, setIsStatusBannerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteBannerOpen, setIsDeleteBannerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);

  const filteredReviews = useMemo(
    () => {
      const data = type === "admin" ? mockAdminTestimonials : mockReviews;
      return data.filter((row) => {
        if (
          searchQuery &&
          !row.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !row.id.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        if (appliedFilters.category !== "All" && row.category !== appliedFilters.category) return false;
        if (appliedFilters.rating !== "All") {
          const ratingNum = parseInt(appliedFilters.rating);
          if (row.rating !== ratingNum) return false;
        }
        
        // Status filtering only applies to user reviews
        if (type === "user") {
          const review = row as typeof mockReviews[0];
          if (appliedFilters.state !== "All" && review.status !== appliedFilters.state) return false;
        }

        if (appliedFilters.date !== "All" && row.date !== appliedFilters.date) return false;
        return true;
      });
    },
    [appliedFilters, searchQuery, type]
  );

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const filterFields = (
    [
      ["category", "Category", filterOptions.category],
      ["rating", "Rating", filterOptions.rating],
      ["state", "State", filterOptions.state],
      ["date", "Date", filterOptions.date],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  const handleAction = (action: { label: string }, row: any) => {
    if (action.label === "View") {
      setSelectedRow(row);
      setIsViewModalOpen(true);
    } else if (action.label === "Change Status") {
      setSelectedRow(row);
      setIsStatusModalOpen(true);
    } else if (action.label === "Delete") {
      setSelectedRow(row);
      setIsDeleteModalOpen(true);
    } else if (action.label === "Edit") {
      setSelectedRow(row);
      setIsEditModalOpen(true);
    }
  };

  const title = customTitle || (type === "admin" ? "Testimonials" : "Reviews");
  const iconSrc = customIconSrc || "/images/dashboard/sidebar/reviews.svg";
  const data = type === "admin" ? mockAdminTestimonials : mockReviews;
  
  let baseColumns = type === "admin" ? adminTestimonialsColumns as any : reviewsColumns as any;
  if (hideCustomerColumn) {
    baseColumns = baseColumns.filter((col: any) => col.id !== "customer");
  }

  if (data.length > 0 && filteredReviews.length === 0) {
    return (
      <DashboardSearchEmptyState onClearSearch={resetFilters} />
    );
  }

  if (data.length === 0) {
    return (
      <DashboardEmptyState
        title={emptyStateTitle || "No Reviews & Testimonials Yet"}
        subtitle={emptyStateSubtitle || "There are no Reviews & Testimonials available at the moment."}
        imageSrc="/images/dashboard/empty.png"
      />
    );
  }

  return (
    <>
      <TablePanel
      ariaLabel={`${title} table`}
      title={title}
      iconSrc={iconSrc}
      showFilters
      showExport
      toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
    >
      <DataTable
        data={filteredReviews}
        columns={baseColumns}
        getRowId={(row) => row.id}
        selectable
        rowActions={type === "admin" ? adminTestimonialRowActions(handleAction) as any : reviewRowActions(handleAction) as any}
        defaultPageSize={5}
      />
    </TablePanel>

    <ViewReviewModal
      open={isViewModalOpen}
      onClose={() => setIsViewModalOpen(false)}
      data={selectedRow}
      type={type}
    />
    
    <ChangeStatusModal
      isOpen={isStatusModalOpen}
      onClose={() => setIsStatusModalOpen(false)}
      currentStatus={selectedRow?.status || "Pending"}
      onConfirm={(newStatus) => {
        // Here you would typically make an API call to update the status
        console.log(`Status for ${selectedRow?.id} changed to ${newStatus}`);
        setIsStatusBannerOpen(true);
      }}
    />

    <DashboardStatusBanner
      show={isStatusBannerOpen}
      onClose={() => setIsStatusBannerOpen(false)}
      message="The status has been updated successfully"
      variant="success"
      className={styles.toastBanner}
    />

    <DashboardConfirmationModal
      open={isDeleteModalOpen}
      variant="delete"
      title={`Delete ${type === "admin" ? "Testimonial" : "Review"}`}
      message={`Are you sure you want to delete this ${type === "admin" ? "testimonial" : "review"}? This action cannot be undone and the ${type === "admin" ? "testimonial" : "review"} will be permanently removed from the system.`}
      cancelLabel="Back"
      confirmLabel="Delete"
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={() => {
        // Mock API call to delete
        console.log(`Deleted ${type === "admin" ? "testimonial" : "review"} ${selectedRow?.id}`);
        setIsDeleteModalOpen(false);
        setIsDeleteBannerOpen(true);
      }}
    />

    <DashboardStatusBanner
      show={isDeleteBannerOpen}
      onClose={() => setIsDeleteBannerOpen(false)}
      message={`The ${type === "admin" ? "testimonial" : "review"} has been deleted successfully`}
      variant="success"
      className={styles.toastBanner}
    />

    <AddTestimonialModal
      isEdit
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      initialData={selectedRow ? {
        customer: selectedRow.customer,
        country: selectedRow.country,
        category: selectedRow.category,
        rating: selectedRow.rating,
        title: selectedRow.title,
        description: selectedRow.description,
        videoUrl: selectedRow.video,
      } : undefined}
      onSubmit={(data) => {
        // TODO: call your API here, e.g. await api.updateTestimonial(selectedRow.id, data)
        console.log("[Edit Testimonial] Submitting:", data);
        setIsEditModalOpen(false);
        setIsEditBannerOpen(true);
      }}
    />

    <DashboardStatusBanner
      show={isEditBannerOpen}
      onClose={() => setIsEditBannerOpen(false)}
      message="The testimonial has been updated successfully"
      variant="success"
      className={styles.toastBanner}
    />
    </>
  );
}
