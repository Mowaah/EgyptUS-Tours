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

export default function CatalogDestinationsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | undefined>(undefined);
  
  const [deletingDest, setDeletingDest] = useState<Destination | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleSaveModal = (data: { name: string; file?: File }) => {
    console.log("Save destination", data);
    handleCloseModal();
    setSuccessMessage(
      editingDest
        ? "The Destination has been updated successfully"
        : "The New Destination has been added successfully"
    );
  };

  const handleDeleteConfirm = () => {
    console.log("Deleted destination", deletingDest?.id);
    setDeletingDest(undefined);
    setSuccessMessage("The Destination has been deleted successfully");
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
            <strong>{`"${deletingDest?.name}"`}</strong> is linked to 12 trips.<br />
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
    </div>
  );
}
