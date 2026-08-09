"use client";

import { useState } from "react";
import { mutate } from "swr";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import HotelsTabs from "@/components/dashboard/Catalog/Hotels/HotelsTabs/HotelsTabs";
import LocationsPanel from "@/components/dashboard/Catalog/Hotels/Locations/LocationsPanel/LocationsPanel";
import LocationModal from "@/components/dashboard/Catalog/Hotels/Locations/LocationModal/LocationModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import type { Location } from "@/components/dashboard/Catalog/Hotels/Locations/LocationCard/LocationCard";
import dashboardStyles from "../../../page.module.scss";
import styles from "./page.module.scss";
import { createCatalogHotelLocation, updateCatalogHotelLocation, deleteCatalogHotelLocation } from "@/services/admin/adminCatalogHotelsService";

export default function CatalogLocationsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | undefined>(undefined);
  
  const [deletingLocation, setDeletingLocation] = useState<Location | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingLocation(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = (Location: Location) => {
    setEditingLocation(Location);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingLocation(undefined);
  };

  const handleSaveModal = async (data: { translations: Record<string, { name: string }> }) => {
    try {
      setIsSubmitting(true);
      if (editingLocation) {
        await updateCatalogHotelLocation(editingLocation.id, { translations: data.translations });
        setSuccessMessage("The Location has been updated successfully");
      } else {
        await createCatalogHotelLocation({ translations: data.translations });
        setSuccessMessage("The New Location has been added successfully");
      }
      await mutate("adminCatalogHotelLocations");
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save location", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLocation) return;
    try {
      setIsSubmitting(true);
      await deleteCatalogHotelLocation(deletingLocation.id);
      await mutate("adminCatalogHotelLocations");
      setSuccessMessage("The Location has been deleted successfully");
      setDeletingLocation(undefined);
    } catch (error) {
      console.error("Failed to delete location", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Hotels"
        subtitle="Centralize hotel management, pricing references, and accommodation details."
        primaryAction={{ label: "Add New Location", disabled: isSubmitting }}
        onPrimaryAction={handleOpenAdd}
        hideSearch={false}
      />
      <div className={styles.content}>
        <HotelsTabs />
        <LocationsPanel 
          onEditLocation={handleOpenEdit} 
          onDeleteLocation={setDeletingLocation}
        />
      </div>

      <LocationModal
        key={`${modalOpen ? "open" : "closed"}-${editingLocation?.id || "new"}`}
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        isEdit={!!editingLocation}
        initialName={editingLocation?.translations || {}}
      />

      <DashboardConfirmationModal
        open={!!deletingLocation}
        variant="delete"
        title="Delete Location?"
        message={
          <>
            <strong>{`"${deletingLocation?.name}"`}</strong> is linked to some hotels.<br />
            Deleting it will remove this location from those hotels
          </>
        }
        cancelLabel="Cancel"
        confirmLabel={isSubmitting ? "Deleting..." : "Delete"}
        onClose={() => setDeletingLocation(undefined)}
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
