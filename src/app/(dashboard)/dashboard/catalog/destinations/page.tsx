"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import CatalogTabs from "@/components/dashboard/Catalog/CatalogTabs/CatalogTabs";
import DestinationsPanel from "@/components/dashboard/Catalog/Destinations/DestinationsPanel/DestinationsPanel";
import DestinationModal from "@/components/dashboard/Catalog/Destinations/DestinationModal/DestinationModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import type { Destination } from "@/components/dashboard/Catalog/Destinations/DestinationCard/DestinationCard";
import dashboardStyles from "../../page.module.scss";
import styles from "./page.module.scss";
import { createDestination, updateDestination, deleteDestination } from "@/services/admin/adminCatalogDestinationsService";

function getMutationErrorMessage(error: unknown, fallback: string) {
  const data = (error as { response?: { data?: unknown; status?: number } })?.response?.data;
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

export default function CatalogDestinationsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | undefined>(undefined);
  
  const [deletingDest, setDeletingDest] = useState<Destination | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenAdd = () => {
    setEditingDest(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = (dest: Destination) => {
    setEditingDest(dest);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDest(undefined);
  };

  const handleSaveModal = async (data: { name: string; file?: File }) => {
    try {
      const payload = { name: data.name, image: data.file };

      if (editingDest) {
        await updateDestination(editingDest.id, payload);
        setSuccessMessage("The Destination has been updated successfully");
      } else {
        await createDestination(payload);
        setSuccessMessage("The New Destination has been added successfully");
      }
      
      setRefreshTrigger(prev => prev + 1);
      handleCloseModal();
    } catch (error: unknown) {
      console.error("Mutation failed:", error);
      // Let the user know the backend hasn't implemented it yet if it's a 404
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        setErrorMessage("Action failed: The backend admin endpoint for destinations is not implemented yet. Tell your backend team!");
      } else {
        setErrorMessage(getMutationErrorMessage(error, "An error occurred while saving the destination."));
      }
      handleCloseModal();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDest) return;
    try {
      await deleteDestination(deletingDest.id);
      setSuccessMessage("The Destination has been deleted successfully");
      setRefreshTrigger(prev => prev + 1);
      setDeletingDest(undefined);
    } catch (error: unknown) {
      console.error("Delete failed:", error);
      if ((error as { response?: { status?: number } })?.response?.status === 404) {
        setErrorMessage("Action failed: The backend admin endpoint for destinations is not implemented yet. Tell your backend team!");
      } else {
        setErrorMessage(getMutationErrorMessage(error, "An error occurred while deleting the destination."));
      }
      setDeletingDest(undefined);
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Trips"
        subtitle="Manage all trip products visible on the website"
        primaryAction={{ label: "Add New Destination" }}
        onPrimaryAction={handleOpenAdd}
        hideSearch={false}
      />
      <div className={styles.content}>
        <CatalogTabs />
        <DestinationsPanel 
          onEditDestination={handleOpenEdit} 
          onDeleteDestination={setDeletingDest}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <DestinationModal
        key={`${modalOpen ? "open" : "closed"}-${editingDest?.id || "new"}`}
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        isEdit={!!editingDest}
        initialName={editingDest?.name || ""}
      />

      <DashboardConfirmationModal
        open={!!deletingDest}
        variant="delete"
        title="Delete Destination"
        message={
          <>
            <strong>{`"${deletingDest?.name}"`}</strong> is linked to trips.<br />
            Are you sure you want to delete it?
          </>
        }
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onClose={() => setDeletingDest(undefined)}
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
