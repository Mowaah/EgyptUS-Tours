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
import { createVehicleCategory, updateVehicleCategory, deleteVehicleCategory } from "@/services/admin/adminCatalogVehicleCategoriesService";

function getMutationErrorMessage(error: unknown, fallback: string) {
  const data = (error as { response?: { data?: unknown } })?.response?.data;
  if (data) {
    try {
      return `Backend Error: ${JSON.stringify(data)}`;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export default function TransportationCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
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
      const nameVal = data.translations?.en?.name;
      const payload: Record<string, unknown> = { ...data, name: nameVal };
      if (editingCategory) {
        await updateVehicleCategory(editingCategory.id, payload);
        setSuccessMessage("The Vehicle Category has been updated successfully");
      } else {
        await createVehicleCategory(payload);
        setSuccessMessage("The New Vehicle Category has been added successfully");
      }
      
      setRefreshTrigger(prev => prev + 1);
      handleCloseModal();
    } catch (error: unknown) {
      console.error("Mutation failed:", error);
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        setErrorMessage("Action failed: The backend admin endpoint for vehicle categories is not implemented yet. Tell your backend team!");
      } else {
        setErrorMessage(getMutationErrorMessage(error, "An error occurred while saving the vehicle category."));
      }
      handleCloseModal();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      await deleteVehicleCategory(deletingCategory.id);
      setSuccessMessage("The Vehicle Category has been deleted successfully");
      setRefreshTrigger(prev => prev + 1);
      setDeletingCategory(undefined);
    } catch (error: unknown) {
      console.error("Delete failed:", error);
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        setErrorMessage("Action failed: The backend admin endpoint for vehicle categories is not implemented yet. Tell your backend team!");
      } else {
        setErrorMessage(getMutationErrorMessage(error, "An error occurred while deleting the vehicle category."));
      }
      setDeletingCategory(undefined);
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Vehicles"
        subtitle="Manage your vehicle fleet for transfers and tours."
        primaryAction={{ label: "Add New Category" }}
        onPrimaryAction={handleOpenAdd}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className={styles.content}>
        <TransportationTabs />
        <VehicleCategoriesPanel 
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
          onEditCategory={handleOpenEdit} 
          onDeleteCategory={setDeletingCategory}
          onAddCategory={handleOpenAdd}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <VehicleCategoryModal
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
        title="Delete Vehicle Category"
        message={
          <>
            <strong>{`"${deletingCategory?.name}"`}</strong> is linked to Vehicles.<br />
            Deleting it will remove this category from those Vehicles
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
