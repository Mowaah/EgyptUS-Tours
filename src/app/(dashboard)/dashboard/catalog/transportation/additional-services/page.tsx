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

export default function TransportationAdditionalServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdditionalService | undefined>(undefined);
  
  const [deletingService, setDeletingService] = useState<AdditionalService | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleSaveModal = (data: { name: string; price: string }) => {
    console.log("Save additional service", data);
    handleCloseModal();
    setSuccessMessage(
      editingService
        ? "The Additional Service has been updated successfully"
        : "The New Additional Service has been added successfully"
    );
  };

  const handleDeleteConfirm = () => {
    console.log("Deleted service", deletingService?.id);
    setDeletingService(undefined);
    setSuccessMessage("The Additional Service has been deleted successfully");
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
        />
      </div>

      <AdditionalServiceModal
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
            <strong>"{deletingService?.name}"</strong> is linked to 12 Vehicles.<br />
            Deleting it will remove this category from those Vehicle
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
    </div>
  );
}
