"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateVehicle } from "@/components/dashboard/Catalog/Transportation/CreateVehicle/CreateVehicle";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal } from "@/components/dashboard/shared";
import styles from "../page.module.scss";

export default function CreateVehiclePage() {
  const router = useRouter();
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleSaveDraft = () => {
    setIsDraftModalOpen(false);
    router.push("/dashboard/catalog/transportation?draft=true");
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar
        title="Add New Vehicle"
        subtitle="Add a new vehicle and configure its specifications, pricing, and availability."
        breadcrumbTrail={[
          { label: "Catalog", href: "/dashboard/catalog/transportation" },
          { label: "Add New Vehicle" },
        ]}
        hideSearch={true}
        hideFilterButton={true}
        secondaryAction={{ label: "Discard", disabled: !isDirty }}
        primaryAction={{ label: "Save as draft", iconSrc: "/images/dashboard/save2.svg", variant: "tertiary", disabled: !isDirty }}
        onSecondaryAction={() => setIsDiscardModalOpen(true)}
        onPrimaryAction={() => setIsDraftModalOpen(true)}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <CreateVehicle onDirtyChange={setIsDirty} />
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

      <DashboardConfirmationModal
        open={isDraftModalOpen}
        variant="activate"
        onClose={() => setIsDraftModalOpen(false)}
        onConfirm={handleSaveDraft}
        title="Save Vehicle as Draft?"
        message="The vehicle will not be published and can be edited or published later."
        confirmLabel="Save as Draft"
        cancelLabel="Cancel"
      />
    </div>
  );
}
