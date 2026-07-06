"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateTrip } from "@/components/dashboard/Catalog/Trips/CreateTrip";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal } from "@/components/dashboard/shared";
import styles from "../page.module.scss";

export default function CreateTripPage() {
  const router = useRouter();
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const handleSaveDraft = () => {
    setIsDraftModalOpen(false);
    const form = document.getElementById("create-trip-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Add New Trip"
        subtitle="Experience the thrill of dune bashing and traditional Bedouin camp."
        breadcrumbTrail={[
          { label: "Catalog", href: "/dashboard/catalog/trips" },
          { label: "Add New Trip" },
        ]}
        hideSearch={true}
        hideFilterButton={true}
        secondaryAction={{ label: "Discard" }}
        primaryAction={{ label: "Save as draft", iconSrc: "/images/dashboard/save2.svg", variant: "tertiary" }}
        onSecondaryAction={() => setIsDiscardModalOpen(true)}
        onPrimaryAction={() => setIsDraftModalOpen(true)}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <CreateTrip />
      </Suspense>

      <DashboardConfirmationModal
        open={isDiscardModalOpen}
        variant="activate"
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirm={() => {
          setIsDiscardModalOpen(false);
          router.push("/dashboard/catalog/trips");
        }}
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
        title="Save Trip as Draft?"
        message="The trip will not be published and can be edited or published later."
        confirmLabel="Save as Draft"
        cancelLabel="Cancel"
      />
    </div>
  );
}
