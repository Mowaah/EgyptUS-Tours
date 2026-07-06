"use client";

import { Suspense, use, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateTrip } from "@/components/dashboard/Catalog/Trips/CreateTrip";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal } from "@/components/dashboard/shared";
import styles from "../../page.module.scss";

export default function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  const handleSaveChanges = () => {
    const form = document.getElementById("create-trip-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Edit Trip"
        subtitle="Update trip details, pricing, itinerary, and availability information."
        breadcrumbTrail={[
          { label: "Catalog", href: "/dashboard/catalog/trips" },
          { label: "Edit Trip" },
        ]}
        hideSearch={true}
        hideFilterButton={true}
        secondaryAction={{ label: "Discard" }}
        primaryAction={{ label: "Save Changes", iconSrc: "/images/dashboard/save.svg" }}
        onSecondaryAction={() => setIsDiscardModalOpen(true)}
        onPrimaryAction={handleSaveChanges}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <CreateTrip tripId={id} />
      </Suspense>

      <DashboardConfirmationModal
        open={isDiscardModalOpen}
        variant="activate"
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirm={() => {
          setIsDiscardModalOpen(false);
          router.push(`/dashboard/catalog/trips/${id}`);
        }}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmLabel="Keep Editing"
        cancelLabel="Discard Changes"
      />
    </div>
  );
}
