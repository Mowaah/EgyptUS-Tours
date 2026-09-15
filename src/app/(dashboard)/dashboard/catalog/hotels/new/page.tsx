"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateHotel, CreateHotelFormHandle } from "@/components/dashboard/Catalog/Hotels/CreateHotel/CreateHotel";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { DashboardConfirmationModal } from "@/components/dashboard/shared";
import styles from "../page.module.scss";

export default function CreateHotelPage() {
  const router = useRouter();
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const formRef = useRef<CreateHotelFormHandle>(null);

  const handleSaveDraft = () => {
    setIsDraftModalOpen(false);
    formRef.current?.saveDraft();
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Add New Hotel"
        subtitle="Add a new hotel to make it available for bookings"
        breadcrumbTrail={[
          { label: "Catalog", href: "/dashboard/catalog/hotels" },
          { label: "Add New Hotel" },
        ]}
        hideSearch={true}
        hideFilterButton={true}
        secondaryAction={{ label: "Discard", disabled: !isDirty }}
        primaryAction={{ label: "Save as draft", iconSrc: "/images/dashboard/save2.svg", variant: "tertiary", disabled: !isDirty }}
        onSecondaryAction={() => setIsDiscardModalOpen(true)}
        onPrimaryAction={() => setIsDraftModalOpen(true)}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <CreateHotel ref={formRef} onDirtyChange={setIsDirty} />
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

      <DashboardConfirmationModal
        open={isDraftModalOpen}
        variant="activate"
        onClose={() => setIsDraftModalOpen(false)}
        onConfirm={handleSaveDraft}
        title="Save Hotel as Draft?"
        message="The hotel will not be published and can be edited or published later."
        confirmLabel="Save as Draft"
        cancelLabel="Cancel"
      />
    </div>
  );
}
