"use client";

import { use, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateHotel } from "@/components/dashboard/Catalog/Hotels/CreateHotel/CreateHotel";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal } from "@/components/dashboard/shared";
import styles from "../../page.module.scss";

export default function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleSaveChanges = () => {
    const form = document.getElementById("create-hotel-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Edit Hotel"
        subtitle="Update the details of this hotel"
        breadcrumbTrail={[
          { label: "Catalog", href: "/dashboard/catalog/hotels" },
          { label: "Hotels", href: "/dashboard/catalog/hotels" },
          { label: "Edit Hotel" },
        ]}
        hideSearch={true}
        hideFilterButton={true}
        secondaryAction={{ label: "Discard", disabled: !isDirty }}
        primaryAction={{ label: "Save Changes", iconSrc: "/images/dashboard/save.svg", disabled: !isDirty }}
        onSecondaryAction={() => setIsDiscardModalOpen(true)}
        onPrimaryAction={handleSaveChanges}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <CreateHotel hotelId={id} onDirtyChange={setIsDirty} />
      </Suspense>

      <DashboardConfirmationModal
        open={isDiscardModalOpen}
        variant="activate"
        onClose={() => {
          setIsDiscardModalOpen(false);
          router.push("/dashboard/catalog/hotels?discarded=true");
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
