"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import TransportationTabs from "@/components/dashboard/Catalog/Transportation/TransportationTabs/TransportationTabs";
import AdditionalServicesPanel from "@/components/dashboard/Catalog/Transportation/AdditionalServices/AdditionalServicesPanel/AdditionalServicesPanel";
import AdditionalServiceModal from "@/components/dashboard/Catalog/Transportation/AdditionalServices/AdditionalServiceModal/AdditionalServiceModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import type { AdditionalService } from "@/components/dashboard/Catalog/Transportation/AdditionalServices/AdditionalServiceCard/AdditionalServiceCard";
import dashboardStyles from "../../../page.module.scss";
import styles from "./page.module.scss";
import { createVehicleAdditionalService, updateVehicleAdditionalService, deleteVehicleAdditionalService } from "@/services/admin/adminCatalogVehicleAdditionalServicesService";

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

export default function TransportationAdditionalServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdditionalService | undefined>(undefined);
  
  const [deletingService, setDeletingService] = useState<AdditionalService | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenAdd = () => {
    setEditingService(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = (service: AdditionalService) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingService(undefined);
  };

  const handleSaveModal = async (data: { name: string; price: string }) => {
    try {
      if (editingService) {
        await updateVehicleAdditionalService(editingService.id, data);
        setSuccessMessage("The Additional Service has been updated successfully");
      } else {
        await createVehicleAdditionalService(data);
        setSuccessMessage("The New Additional Service has been added successfully");
      }
      
      setRefreshTrigger(prev => prev + 1);
      handleCloseModal();
    } catch (error: unknown) {
      console.error("Mutation failed:", error);
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        setErrorMessage("Action failed: The backend admin endpoint for vehicle additional services is not implemented yet. Tell your backend team!");
      } else {
        setErrorMessage(getMutationErrorMessage(error, "An error occurred while saving the additional service."));
      }
      handleCloseModal();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    try {
      await deleteVehicleAdditionalService(deletingService.id);
      setSuccessMessage("The Additional Service has been deleted successfully");
      setRefreshTrigger(prev => prev + 1);
      setDeletingService(undefined);
    } catch (error: unknown) {
      console.error("Delete failed:", error);
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        setErrorMessage("Action failed: The backend admin endpoint for vehicle additional services is not implemented yet. Tell your backend team!");
      } else {
        setErrorMessage(getMutationErrorMessage(error, "An error occurred while deleting the additional service."));
      }
      setDeletingService(undefined);
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Vehicles"
        subtitle="Manage your vehicle fleet for transfers and tours."
        primaryAction={{ label: "Add New Additional Service" }}
        onPrimaryAction={handleOpenAdd}
        searchQuery=""
        onSearchChange={() => {}}
        searchPlaceholder="Search Additional Service"
      />
      <div className={styles.content}>
        <TransportationTabs />
        <AdditionalServicesPanel 
          onEditService={handleOpenEdit} 
          onDeleteService={setDeletingService}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <AdditionalServiceModal
        key={`${modalOpen ? "open" : "closed"}-${editingService?.id || "new"}`}
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        isEdit={!!editingService}
        initialName={editingService?.name || ""}
        initialPrice={editingService?.price || ""}
      />

      <DashboardConfirmationModal
        open={!!deletingService}
        variant="delete"
        title="Delete Vehicle Additional Service"
        message={
          <>
            <strong>{`"${deletingService?.name}"`}</strong> is linked to Vehicles.<br />
            Deleting it will remove this additional service from those Vehicles
          </>
        }
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onClose={() => setDeletingService(undefined)}
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
