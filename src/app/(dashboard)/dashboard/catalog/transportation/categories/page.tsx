"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import TransportationTabs from "@/components/dashboard/Catalog/Transportation/TransportationTabs/TransportationTabs";
import VehicleCategoriesPanel from "@/components/dashboard/Catalog/Transportation/VehicleCategories/VehicleCategoriesPanel/VehicleCategoriesPanel";
import VehicleCategoryModal from "@/components/dashboard/Catalog/Transportation/VehicleCategories/VehicleCategoryModal/VehicleCategoryModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import type { Category } from "@/components/dashboard/Catalog/Categories/CategoryCard/CategoryCard";
import dashboardStyles from "../../../page.module.scss";
import styles from "./page.module.scss";

export default function TransportationCategoriesPage() {
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
        ? "The Vehicle Category has been updated successfully"
        : "The New Vehicle Category has been added successfully"
    );
  };

  const handleDeleteConfirm = () => {
    console.log("Deleted category", deletingCategory?.id);
    setDeletingCategory(undefined);
    setSuccessMessage("The Vehicle Category has been deleted successfully");
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Vehicles"
        subtitle="Manage your vehicle fleet for transfers and tours."
        primaryAction={{ label: "Add New Category" }}
        onPrimaryAction={handleOpenAdd}
        hideSearch={false}
      />
      <div className={styles.content}>
        <TransportationTabs />
        <VehicleCategoriesPanel 
          onEditCategory={handleOpenEdit} 
          onDeleteCategory={setDeletingCategory}
        />
      </div>

      <VehicleCategoryModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        isEdit={!!editingCategory}
        initialName={editingCategory?.name || ""}
      />

      <DashboardConfirmationModal
        open={!!deletingCategory}
        variant="delete"
        title="Delete Vehicle Category"
        message={
          <>
            <strong>"{deletingCategory?.name}"</strong> is linked to 12 Vehicles.<br />
            Deleting it will remove this category from those Vehicle
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
