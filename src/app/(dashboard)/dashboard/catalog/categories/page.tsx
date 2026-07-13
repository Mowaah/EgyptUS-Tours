"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import CatalogTabs from "@/components/dashboard/Catalog/CatalogTabs/CatalogTabs";
import CategoriesPanel from "@/components/dashboard/Catalog/Categories/CategoriesPanel/CategoriesPanel";
import CategoryModal from "@/components/dashboard/Catalog/Categories/CategoryModal/CategoryModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import type { Category } from "@/components/dashboard/Catalog/Categories/CategoryCard/CategoryCard";
import dashboardStyles from "../../page.module.scss";
import styles from "./page.module.scss";

export default function CatalogCategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  
  const [deletingCategory, setDeletingCategory] = useState<Category | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleSaveModal = (data: { name: string }) => {
    console.log("Save category", data);
    handleCloseModal();
    setSuccessMessage(
      editingCategory
        ? "The Trip Category has been updated successfully"
        : "The New Trip Category has been added successfully"
    );
  };

  const handleDeleteConfirm = () => {
    console.log("Deleted category", deletingCategory?.id);
    setDeletingCategory(undefined);
    setSuccessMessage("The Trip Category has been deleted successfully");
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
        />
      </div>

      <CategoryModal
        key={`${modalOpen ? "open" : "closed"}-${editingCategory?.id || "new"}`}
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        isEdit={!!editingCategory}
        initialName={editingCategory?.name || ""}
      />

      <DashboardConfirmationModal
        open={!!deletingCategory}
        variant="delete"
        title="Delete Trip Category"
        message={
          <>
            <strong>{`"${deletingCategory?.name}"`}</strong> is linked to 12 trips.<br />
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
    </div>
  );
}
