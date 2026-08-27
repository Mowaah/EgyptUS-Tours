"use client";

import { Suspense, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CreateVehicle } from "@/components/dashboard/Catalog/Transportation/CreateVehicle/CreateVehicle";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal } from "@/components/dashboard/shared";
import styles from "../../page.module.scss";

export default function EditVehiclePage() {
  const router = useRouter();
  const paramsObj = useParams();
  const id = (paramsObj?.id as string) || "";
  
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = () => {
    const form = document.getElementById("create-vehicle-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Edit Vehicle"
        subtitle="Update the details of this vehicle"
        breadcrumbTrail={[
          { label: "Catalog", href: "/dashboard/catalog/transportation" },
          { label: "Vehicles", href: "/dashboard/catalog/transportation" },
          { label: "Edit Vehicle" },
        ]}
        hideSearch={true}
        hideFilterButton={true}
        secondaryAction={{ label: "Discard", disabled: !isDirty || isSaving }}
        primaryAction={{ label: "Save Changes", iconSrc: "/images/dashboard/save.svg", disabled: !isDirty, loading: isSaving }}
        onSecondaryAction={() => setIsDiscardModalOpen(true)}
        onPrimaryAction={handleSaveChanges}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <CreateVehicle vehicleId={id} onDirtyChange={setIsDirty} onSavingChange={setIsSaving} />
      </Suspense>

      <DashboardConfirmationModal
        open={isDiscardModalOpen}
        variant="activate"
        onClose={() => {
          setIsDiscardModalOpen(false);
          router.push("/dashboard/catalog/transportation?discarded=true");
        }}
        onConfirm={() => setIsDiscardModalOpen(false)}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmLabel="Keep Editing"
        cancelLabel="Discard Changes"
      />
    </div>
  );
}
