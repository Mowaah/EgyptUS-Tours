"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  TablePanel,
  TablePanelFilterBar,
} from "@/components/dashboard/TablePanel";
import { getReviewsColumns, reviewRowActions, getAdminTestimonialsColumns, adminTestimonialRowActions } from "./reviewsColumns";
import ViewReviewModal from "./ViewReviewModal";
import ChangeStatusModal from "./ChangeStatusModal";
import AddTestimonialModal from "./AddTestimonialModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { useReviewsPanel } from "@/hooks/useReviewsPanel";
import { replyToAdminUserReview, updateAdminTestimonial, updateAdminUserReview, deleteAdminTestimonial, deleteAdminUserReview } from "@/services/admin/adminReviewsService";
import { downloadBlobAsCSV } from "@/lib/utils";
import styles from "./ReviewsPanel.module.scss";

const filterOptions = {
  category: ["All", "Trips", "Transportation", "Hotels", "B2B", "Mice"],
  rating: ["All", "5 stars", "4 stars", "3 stars", "2 stars", "1 star"],
  state: ["All", "Pending", "Replied"],
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
  refreshTrigger?: number;
  customerId?: string;
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
  refreshTrigger = 0,
  customerId,
  onDataChange,
}: ReviewsPanelProps & { onDataChange?: () => void }) {
  const defaultFilters = {
    category: "All",
    rating: "All",
    state: "All",
    date: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isStatusBannerOpen, setIsStatusBannerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteBannerOpen, setIsDeleteBannerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
  const [isReplyBannerOpen, setIsReplyBannerOpen] = useState(false);

  const { data, loading, totalCount, refresh } = useReviewsPanel({
    type,
    searchQuery,
    appliedFilters,
    refreshTrigger,
    customerId,
    page,
    pageSize,
  });

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

  const categoryOptions = type === "user" 
    ? ["All", "Trips", "Transportation", "Hotels"]
    : ["All", "Trips", "Hotels", "Transportation", "B2B", "Mice"];

  const dateOptions = ["All", "Today", "Last 7 Days", "Last 30 Days", "This Month"];

  const filterFields = [
    { id: "category", label: "Category", options: categoryOptions, value: filters.category },
    { id: "rating", label: "Rating", options: filterOptions.rating, value: filters.rating },
    ...(type === "user" ? [{ id: "state", label: "State", options: filterOptions.state, value: filters.state }] : []),
    { id: "date", label: "Date", options: dateOptions, value: filters.date },
  ].map((field) => ({
    ...field,
    onChange: (value: string) => setFilters((current) => ({ ...current, [field.id]: value })),
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
    } else if (action.label === "Reply") {
      window.location.href = `mailto:${row.email || ""}`;
      replyToAdminUserReview(row.originalId, "Replied via email")
        .then(() => {
          return updateAdminUserReview(row.originalId, { moderation_status: "approved" });
        })
        .then(() => {
          setIsReplyBannerOpen(true);
          refresh();
          onDataChange?.();
        })
        .catch(e => {
          console.error("Failed to mark as replied", e);
        });
    }
  };

  const title = customTitle || (type === "admin" ? "Testimonials" : "Reviews");
  const iconSrc = customIconSrc || "/images/dashboard/sidebar/reviews.svg";
  
  const baseColumns = useMemo(() => {
    const handleTogglePublished = async (row: any, newFeaturedOrPublished: boolean) => {
      try {
        if (type === "user") {
          await updateAdminUserReview(row.originalId, { is_featured: newFeaturedOrPublished });
        } else {
          await updateAdminTestimonial(row.originalId, { status: newFeaturedOrPublished ? "published" : "draft" });
        }
        refresh();
        onDataChange?.();
      } catch (e) {
        console.error("Failed to update status", e);
      }
    };

    let cols = type === "admin" 
      ? getAdminTestimonialsColumns(handleTogglePublished) as any 
      : getReviewsColumns(handleTogglePublished) as any;

    if (hideCustomerColumn) {
      cols = cols.filter((col: any) => col.id !== "customer");
    }
    return cols;
  }, [type, hideCustomerColumn, refresh, onDataChange]);

  if (loading && data.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        Loading data...
      </div>
    );
  }

  // We rely on the backend to filter. If data is empty and we have a search query, show search empty state.
  if (data.length === 0 && searchQuery) {
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

  const handleExportClick = () => {
    if (!data || data.length === 0) return;

    let exportRows: Record<string, any>[] = [];
    let filename = "";

    if (type === "user") {
      filename = "user_reviews.csv";
      exportRows = data.map((item: any) => ({
        "Review ID": item.id || "",
        "Customer": item.customer || item.author_name || "",
        "Category": item.category || "",
        "Rating": item.rating || 5,
        "Title": item.title || "",
        "Review Text": item.body || "",
        "Date": item.date || "",
        "Status": item.status || "",
        "Featured": item.featured ? "Yes" : "No",
      }));
    } else {
      filename = "admin_testimonials.csv";
      exportRows = data.map((item: any) => ({
        "Testimonial ID": item.id || "",
        "Customer Name": item.customer || "",
        "Country": item.country || "",
        "Category": item.category || "",
        "Rating": item.rating || 5,
        "Title": item.title || "",
        "Description": item.description || item.body || "",
        "Status": item.published ? "Published" : "Draft",
      }));
    }

    if (exportRows.length === 0) return;

    const headers = Object.keys(exportRows[0]);
    const csvLines = [
      headers.join(","),
      ...exportRows.map((row) =>
        headers
          .map((header) => {
            const val = row[header] ?? "";
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ];
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    downloadBlobAsCSV(blob, filename);
  };

  return (
    <>
      <TablePanel
        ariaLabel={`${title} table`}
        title={title}
        iconSrc={iconSrc}
        showFilters
        showExport
        onExportClick={handleExportClick}
        toolbar={<TablePanelFilterBar fields={filterFields} onClean={resetFilters} onApply={applyFilters} />}
      >
        <DataTable
          data={data}
          columns={baseColumns}
          rowActions={type === "admin" ? adminTestimonialRowActions(handleAction) as any : reviewRowActions(handleAction) as any}
          getRowId={(row: any) => String(row.id)}
          serverSidePagination={true}
          totalCount={totalCount}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPageChange={(p) => setPage(p + 1)}
          onPageSizeChange={setPageSize}
          defaultPageSize={10}
        isLoading={loading}
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
      onConfirm={async (newStatus) => {
        try {
          if (type === "user") {
             const modStatus = newStatus === "Replied" ? "approved" : "pending";
             await updateAdminUserReview(selectedRow?.originalId, { moderation_status: modStatus as any });
          } else {
             const adminStatus = newStatus === "Replied" ? "published" : "draft";
             await updateAdminTestimonial(selectedRow?.originalId, { status: adminStatus as any });
          }
          setIsStatusBannerOpen(true);
          refresh();
          onDataChange?.();
        } catch (e) {
          console.error("Failed to update status", e);
        }
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
      onConfirm={async () => {
        try {
          if (type === "admin") {
            await deleteAdminTestimonial(selectedRow?.originalId);
          } else {
            await deleteAdminUserReview(selectedRow?.originalId);
          }
          setIsDeleteModalOpen(false);
          setIsDeleteBannerOpen(true);
          refresh();
          onDataChange?.();
        } catch (e) {
          console.error("Failed to delete", e);
        }
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
        category: (() => {
          const cat = (selectedRow.category || "").toLowerCase();
          if (cat === "trips") return "trip";
          if (cat === "hotels") return "hotel";
          if (cat === "transportation") return "transport";
          return cat;
        })(),
        rating: selectedRow.rating,
        title: selectedRow.title,
        description: selectedRow.description || selectedRow.body,
        videoUrl: selectedRow.videoUrl,
        published: selectedRow.published,
      } : undefined}
      onSubmit={async (data) => {
        try {
          await updateAdminTestimonial(selectedRow?.originalId, {
            customer_name: data.customer,
            country: data.country,
            category: (() => {
              const cat = (data.category || "").toLowerCase();
              if (cat === "trips") return "trip";
              if (cat === "hotels") return "hotel";
              if (cat === "transportation") return "transport";
              return cat;
            })() as any,
            rating: Number(data.rating),
            title: data.title,
            description: data.description,
            video_url: data.videoUrl || "",
            status: data.published ? "published" : "draft",
          });
          setIsEditModalOpen(false);
          setIsEditBannerOpen(true);
          refresh();
          onDataChange?.();
        } catch (e) {
          console.error("Failed to edit testimonial", e);
        }
      }}
    />

    <DashboardStatusBanner
      show={isEditBannerOpen}
      onClose={() => setIsEditBannerOpen(false)}
      message="The testimonial has been updated successfully"
      variant="success"
      className={styles.toastBanner}
    />

    <DashboardStatusBanner
      show={isReplyBannerOpen}
      onClose={() => setIsReplyBannerOpen(false)}
      message="The review has been marked as replied"
      variant="success"
      className={styles.toastBanner}
    />
    </>
  );
}
