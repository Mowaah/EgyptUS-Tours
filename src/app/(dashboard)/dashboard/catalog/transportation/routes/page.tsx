"use client";

import { useState, useMemo } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import TransportationTabs from "@/components/dashboard/Catalog/Transportation/TransportationTabs/TransportationTabs";
import VehicleRoutesPanel from "@/components/dashboard/Catalog/Transportation/VehicleRoutes/VehicleRoutesPanel/VehicleRoutesPanel";
import VehicleRouteModal from "@/components/dashboard/Catalog/Transportation/VehicleRoutes/VehicleRouteModal/VehicleRouteModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import { useVehicleCategories } from "@/hooks/useCatalogVehicles";
import {
  createVehicleRoute,
  updateVehicleRoute,
  deleteVehicleRoute,
  type VehicleRouteItem,
  type RouteMutationPayload,
} from "@/services/admin/adminCatalogVehicleRoutesService";
import dashboardStyles from "../../../page.module.scss";
import styles from "./page.module.scss";

export default function VehicleRoutesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<VehicleRouteItem | null>(null);
  const [deletingRoute, setDeletingRoute] = useState<VehicleRouteItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ show: boolean; message: string; variant: "success" | "warning" }>({
    show: false,
    message: "",
    variant: "success",
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { categories: rawCategories } = useVehicleCategories();

  const categoriesForModal = useMemo(() => {
    if (!Array.isArray(rawCategories)) return [];
    return rawCategories.map((c: { id?: number | string; name?: string }) => ({
      id: Number(c.id),
      name: c.name || `Category ${c.id}`,
    }));
  }, [rawCategories]);

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (route: VehicleRouteItem) => {
    setEditingRoute(route);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingRoute(null);
  };

  const handleSaveModal = async (payload: RouteMutationPayload) => {
    try {
      setSaving(true);
      if (editingRoute) {
        await updateVehicleRoute(editingRoute.id, payload);
        setBanner({
          show: true,
          message: "The route has been updated successfully",
          variant: "success",
        });
      } else {
        await createVehicleRoute(payload);
        setBanner({
          show: true,
          message: "The new route has been created successfully",
          variant: "success",
        });
      }
      setRefreshTrigger((prev) => prev + 1);
      handleCloseModal();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string; message?: string } } };
      const errorMsg =
        errorObj?.response?.data?.detail ||
        errorObj?.response?.data?.message ||
        "An error occurred while saving the route.";
      setBanner({ show: true, message: errorMsg, variant: "warning" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRoute) return;
    try {
      await deleteVehicleRoute(deletingRoute.id);
      setBanner({
        show: true,
        message: "The route has been deleted successfully",
        variant: "success",
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string; message?: string } } };
      const errorMsg =
        errorObj?.response?.data?.detail ||
        errorObj?.response?.data?.message ||
        "An error occurred while deleting the route.";
      setBanner({ show: true, message: errorMsg, variant: "warning" });
    } finally {
      setDeletingRoute(null);
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar
        title="Vehicles"
        subtitle="Manage your vehicle fleet for transfers and tours."
        primaryAction={{ label: "Add New Route" }}
        onPrimaryAction={handleOpenAdd}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className={styles.content}>
        <TransportationTabs />
        <VehicleRoutesPanel
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
          onEditRoute={handleOpenEdit}
          onDeleteRoute={setDeletingRoute}
          onAddRoute={handleOpenAdd}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <VehicleRouteModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        initialData={editingRoute}
        categories={categoriesForModal}
        isEdit={!!editingRoute}
        isLoading={saving}
      />

      <DashboardConfirmationModal
        open={!!deletingRoute}
        variant="delete"
        title="Delete Route?"
        message={
          deletingRoute
            ? `Are you sure you want to delete route "${deletingRoute.route_code || `${deletingRoute.from_location} - ${deletingRoute.to_location}`}"? This action cannot be undone.`
            : ""
        }
        cancelLabel="Cancel"
        confirmLabel="Delete Route"
        onClose={() => setDeletingRoute(null)}
        onConfirm={handleDeleteConfirm}
      />

      <DashboardStatusBanner
        show={banner.show}
        variant={banner.variant}
        message={banner.message}
        onClose={() => setBanner({ show: false, message: "", variant: "success" })}
        className={dashboardStyles.draftBanner}
      />
    </div>
  );
}
