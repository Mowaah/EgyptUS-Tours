"use client";

import { Suspense, use } from "react";
import { useRouter } from "next/navigation";
import { CreateTrip } from "@/components/dashboard/Catalog/Trips/CreateTrip";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import styles from "../../page.module.scss";

export default function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const handleSaveDraft = () => {
    // Triggers form submission
    const form = document.getElementById("create-trip-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar 
        title="Edit Trip"
        subtitle="Experience the thrill of dune bashing and traditional Bedouin camp."
        breadcrumbTrail={[
          { label: "Home", href: "/dashboard" },
          { label: "Catalog", href: "/dashboard/catalog/trips" },
          { label: "Edit Trip" },
        ]}
        hideSearch={true}
        hideFilterButton={true}
        secondaryAction={{ label: "Discard" }}
        primaryAction={{ label: "Save as draft", iconSrc: "/images/dashboard/navbar/add-circle.svg" }}
        onSecondaryAction={() => router.push("/dashboard/catalog/trips")}
        onPrimaryAction={handleSaveDraft}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <CreateTrip tripId={id} />
      </Suspense>
    </div>
  );
}
