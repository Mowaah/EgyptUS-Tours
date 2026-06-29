"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ContentGrid, { type ContentItem } from "@/components/dashboard/ContentGrid/ContentGrid";
import FaqViewModal from "@/components/dashboard/FaqViewModal/FaqViewModal";
import FaqFormModal from "@/components/dashboard/FaqFormModal/FaqFormModal";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import { useContentManager } from "@/hooks/useContentManager";
import styles from "../../page.module.scss";

// Dummy data for visual — swap with real API data later
const INITIAL_DATA: ContentItem[] = [
  { id: "1", title: "What's included in the trip price?", content: "Each trip includes clearly listed services such as accommodation, transportation tours, and selected meals. Full details are available on the trip details page.", status: "Draft", lastUpdated: "May 13, 2026" },
  { id: "2", title: "Can I customize a trip or book a private tour?", content: "Yes! You can choose between group or private trips, and customize your itinerary based on your preferences, budget, and travel style.", status: "Published", lastUpdated: "May 13, 2026" },
  { id: "3", title: "Are there discounts or special offers?", content: "Yes, we offer seasonal discounts and exclusive deals on selected trips and hotels. Check the homepage or subscribe to our newsletter for updates.", status: "Draft", lastUpdated: "May 13, 2026" },
  { id: "4", title: "How do I book a trip and confirm availability?", content: "Simply select your trip, check available dates, and proceed with booking. A trip manager will contact you to confirm all details after reservation.", status: "Published", lastUpdated: "May 13, 2026" },
  { id: "5", title: "Can I book for a group or multiple people?", content: "Yes, you can book trips or accommodations for groups. Just select the number of travelers during the booking process.", status: "Draft", lastUpdated: "May 13, 2026" },
  { id: "6", title: "How do I know my booking is confirmed?", content: "You will receive an email confirmation immediately after completing your reservation, including all booking details.", status: "Published", lastUpdated: "May 13, 2026" },
];

export default function FaqManagementPage() {
  const {
    contentGridRef,
    data,
    viewState,
    setViewState,
    editState,
    setEditState,
    addOpen,
    setAddOpen,
    saveSuccessOpen,
    setSaveSuccessOpen,
    saveMode,
    deleteItem,
    setDeleteItem,
    handleView,
    handleEdit,
    handleAdd,
    handlePublishItem,
    handleUnpublishItem,
    handleDeleteItem,
    confirmDelete,
    handleSave,
  } = useContentManager({
    initialData: INITIAL_DATA,
    itemName: "FAQ",
  });

  return (
    <>
      
      
        <DashboardNavbar onPrimaryAction={() => setAddOpen(true)} />
        <ContentGrid 
          ref={contentGridRef}
          title="Published Questions on the Website"
          ariaLabel="FAQ Management Content"
          iconSrc="/images/dashboard/sidebar/faq.svg"
          items={data}
          onAdd={handleAdd}
          onViewItem={handleView}
          onEditItem={handleEdit}
          onPublishItem={handlePublishItem}
          onUnpublishItem={handleUnpublishItem}
          onDeleteItem={handleDeleteItem}
          emptyStateTitle="No FAQs Yet"
          emptyStateSubtitle="Add your first FAQ to help users quickly find answers and support information."
          emptyStateActionLabel="Add New FAQ"
        />
      

      {/* View modal */}
      <FaqViewModal
        open={viewState !== null}
        index={viewState?.index ?? 1}
        title={viewState?.item.title ?? ""}
        content={viewState?.item.content ?? ""}
        onClose={() => setViewState(null)}
        onEdit={() => handleEdit(viewState!.item)}
      />

      {/* Add modal */}
      <FaqFormModal
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSave={(question, answer, published) => {
          setAddOpen(false);
          handleSave(question, answer, published, "add");
        }}
      />

      {/* Edit modal */}
      <FaqFormModal
        open={editState !== null}
        mode="edit"
        initialData={editState ? { question: editState.title, answer: editState.content, status: editState.status as "Draft" | "Published" } : undefined}
        onClose={() => setEditState(null)}
        onSave={(question, answer, published) => {
          setEditState(null);
          handleSave(question, answer, published, "edit");
        }}
      />

      {/* Success */}
      {saveSuccessOpen && (
        <SuccessModal
          title={saveMode === "add" ? "Question Published" : "Question Updated"}
          message="The question is now live on the website and visible to all visitors. You can preview it anytime from the website view."
          primaryButtonText="View live"
          hideSecondaryButton
          onPrimaryClick={() => setSaveSuccessOpen(false)}
          onClose={() => setSaveSuccessOpen(false)}
        />
      )}

      {/* Delete Confirmation */}
      <DashboardConfirmationModal
        open={deleteItem !== null}
        variant="delete"
        title="Delete FAQ Item"
        message="Are you sure you want to remove this FAQ from the website? This action cannot be undone and the question will no longer appear to users."
        cancelLabel="Back"
        confirmLabel="Delete"
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

