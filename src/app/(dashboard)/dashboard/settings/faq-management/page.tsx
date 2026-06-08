"use client";

import { useState, useRef } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import ContentGrid, { type ContentItem, type ContentGridRef } from "@/components/dashboard/ContentGrid/ContentGrid";
import FaqFormModal from "@/components/dashboard/FaqFormModal/FaqFormModal";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import styles from "../../page.module.scss";

// Dummy data for visual
const FAQS: ContentItem[] = [];

export default function FaqManagementPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [addSuccessOpen, setAddSuccessOpen] = useState(false);
  const contentGridRef = useRef<ContentGridRef>(null);

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="FAQ Management">
        <DashboardNavbar onPrimaryAction={() => setAddOpen(true)} />
        <ContentGrid 
          ref={contentGridRef}
          title="Published Questions on the Website"
          ariaLabel="FAQ Management Content"
          iconSrc="/images/dashboard/sidebar/faq.svg"
          items={FAQS}
          onAdd={() => setAddOpen(true)}
          emptyStateTitle="No FAQs Yet"
          emptyStateSubtitle="Add your first FAQ to help users quickly find answers and support information."
          emptyStateActionLabel="Add New FAQ"
        />
      </section>

      <FaqFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSave={() => {
          setAddOpen(false);
          setAddSuccessOpen(true);
        }}
      />

      {addSuccessOpen && (
        <SuccessModal
          title="Question Published"
          message="The question is now live on the website and visible to all visitors. You can preview it anytime from the website view."
          primaryButtonText="View live"
          hideSecondaryButton
          onPrimaryClick={() => setAddSuccessOpen(false)}
          onClose={() => setAddSuccessOpen(false)}
        />
      )}
    </main>
  );
}

