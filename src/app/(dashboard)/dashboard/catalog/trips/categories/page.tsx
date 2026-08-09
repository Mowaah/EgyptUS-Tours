"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import CatalogTabs from "@/components/dashboard/Catalog/CatalogTabs/CatalogTabs";
import CategoriesPanel from "@/components/dashboard/Catalog/Categories/CategoriesPanel/CategoriesPanel";
import CategoryModal from "@/components/dashboard/Catalog/Categories/CategoryModal/CategoryModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import type { Category } from "@/components/dashboard/Catalog/Categories/CategoryCard/CategoryCard";
import dashboardStyles from "../../../page.module.scss";
import styles from "./page.module.scss";
import { createCategory, updateCategory, deleteCategory } from "@/services/admin/adminCatalogCategoriesService";

function getMutationErrorMessage(error: unknown, fallback: string) {
  const data = (error as { response?: { data?: unknown } })?.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (typeof record.detail === "string") return record.detail;
    const firstFieldError = Object.entries(record).find(([, value]) => Array.isArray(value) || typeof value === "string");
    if (firstFieldError) {
      const [field, value] = firstFieldError;
      const text = Array.isArray(value) ? value.join(", ") : String(value);
      return `${field}: ${text}`;
    }
  }
  return fallback;
}

export default function CatalogCategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  
  const [deletingCategory, setDeletingCategory] = useState<Category | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenAdd = () => {
    setEditingCategory(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(undefined);
  };

  const handleSaveModal = async (data: { translations: Record<string, { name: string }> }) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        setSuccessMessage("The Trip Category has been updated successfully");
      } else {
        await createCategory(data);
        setSuccessMessage("The New Trip Category has been added successfully");
      }
      
      setRefreshTrigger(prev => prev + 1);
      handleCloseModal();
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        setErrorMessage("Action failed: The backend admin endpoint for categories is not implemented yet. Tell your backend team!");
      } else {
        setErrorMessage(getMutationErrorMessage(error, "An error occurred while saving the category."));
      }
      handleCloseModal();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory(deletingCategory.id);
      setSuccessMessage("The Trip Category has been deleted successfully");
      setRefreshTrigger(prev => prev + 1);
      setDeletingCategory(undefined);
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        setErrorMessage("Action failed: The backend admin endpoint for categories is not implemented yet. Tell your backend team!");
      } else {
        setErrorMessage(getMutationErrorMessage(error, "An error occurred while deleting the category."));
      }
      setDeletingCategory(undefined);
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Trips"
        subtitle="Manage all trip products visible on the website"
        primaryAction={{ label: "Add New Trip Category" }}
        onPrimaryAction={handleOpenAdd}
        hideSearch={false}
      />
      <div className={styles.content}>
        <CatalogTabs />
        <CategoriesPanel 
          onEditCategory={handleOpenEdit} 
          onDeleteCategory={setDeletingCategory}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <CategoryModal
        key={`${modalOpen ? "open" : "closed"}-${editingCategory?.id || "new"}`}
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        isEdit={!!editingCategory}
        initialName={editingCategory?.translations || {}}
      />

      <DashboardConfirmationModal
        open={!!deletingCategory}
        variant="delete"
        title="Delete Trip Category"
        message={
          <>
            <strong>{`"${deletingCategory?.name}"`}</strong> is linked to trips.<br />
            Deleting it will remove this category from those trips
          </>
        }
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onClose={() => setDeletingCategory(undefined)}
        onConfirm={handleDeleteConfirm}
      />

      <DashboardStatusBanner
        show={!!successMessage}
        message={successMessage}
        variant="success"
        onClose={() => setSuccessMessage("")}
        className={dashboardStyles.draftBanner}
      />
      
      <DashboardStatusBanner
        show={!!errorMessage}
        message={errorMessage}
        variant="warning"
        onClose={() => setErrorMessage("")}
        className={dashboardStyles.draftBanner}
      />
    </div>
  );
}
