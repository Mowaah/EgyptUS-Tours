"use client";

import { useState, useRef } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import ContentGrid, { type ContentItem, type ContentGridRef } from "@/components/dashboard/ContentGrid/ContentGrid";
import FaqFormModal from "@/components/dashboard/FaqFormModal/FaqFormModal";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import styles from "../../page.module.scss";

// Dummy data for visual — swap with real API data later
const FAQS: ContentItem[] = [
  { id: "1", title: "What's included in the trip price?", content: "Each trip includes clearly listed services such as accommodation, transportation tours, and selected meals. Full details are available on the trip details page.", status: "Draft", lastUpdated: "May 13, 2026" },
  { id: "2", title: "Can I customize a trip or book a private tour?", content: "Yes! You can choose between group or private trips, and customize your itinerary based on your preferences, budget, and travel style.", status: "Published", lastUpdated: "May 13, 2026" },
  { id: "3", title: "Are there discounts or special offers?", content: "Yes, we offer seasonal discounts and exclusive deals on selected trips and hotels. Check the homepage or subscribe to our newsletter for updates.", status: "Draft", lastUpdated: "May 13, 2026" },
  { id: "4", title: "How do I book a trip and confirm availability?", content: "Simply select your trip, check available dates, and proceed with booking. A trip manager will contact you to confirm all details after reservation.", status: "Published", lastUpdated: "May 13, 2026" },
  { id: "5", title: "Can I book for a group or multiple people?", content: "Yes, you can book trips or accommodations for groups. Just select the number of travelers during the booking process.", status: "Draft", lastUpdated: "May 13, 2026" },
  { id: "6", title: "How do I know my booking is confirmed?", content: "You will receive an email confirmation immediately after completing your reservation, including all booking details.", status: "Published", lastUpdated: "May 13, 2026" },
];

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

