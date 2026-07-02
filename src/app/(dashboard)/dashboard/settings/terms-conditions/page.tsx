"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ContentGrid, { type ContentItem } from "@/components/dashboard/ContentGrid/ContentGrid";
import DocumentViewModal from "@/components/dashboard/DocumentViewModal/DocumentViewModal";
import DocumentFormModal from "@/components/dashboard/DocumentFormModal/DocumentFormModal";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import { useContentManager } from "@/hooks/useContentManager";
import styles from "../../page.module.scss";

// Dummy data for visual â€” swap with real API data later
const INITIAL_DATA: ContentItem[] = [
  { id: "1", title: "General Terms", content: "All users of this website agree to comply with the following general terms and conditions. By accessing or using the site, you accept full responsibility for your actions. Bookings made through the website are subject to availability, and the information provided on the site is for informational purposes only. Prices, services, and schedules may change without prior notice due to seasonal demand, special offers, or unforeseen circumstances. Users are responsible for ensuring the accuracy of the information they provide and for following all instructions during the booking and payment process.\n\nThe website owner reserves the right to suspend, modify, or terminate access to the platform at any time, with or without notice. Any unauthorized use of the website, including attempts to copy, reproduce, or exploit content, is strictly prohibited.", status: "Unpublished", lastUpdated: "May 13, 2026" },
  { id: "2", title: "User Responsibilities", content: "The website and its owners are not liable for personal belongings, accidents, injuries, or events outside our control during your travel, stay, or interactions with services booked through the site. Users are encouraged to obtain appropriate travel insurance to cover unforeseen events.\n\nAny changes, modifications, or cancellations must be communicated promptly. Additional charges may apply depending on the type of modification or service. By using this website, you agree to comply with all applicable local laws and accept that the governing law for any disputes will be [insert country/jurisdiction].", status: "Published", lastUpdated: "May 13, 2026" },
];

export default function TermsConditionsPage() {
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
    itemName: "Terms & Conditions",
  });

  return (
    <>
      
      
        <DashboardNavbar onPrimaryAction={handleAdd} />
        <ContentGrid
          ref={contentGridRef}
          title="Terms & Conditions"
          ariaLabel="Terms & Conditions Content"
          iconSrc="/images/dashboard/sidebar/terms-conditions.svg"
          items={data}
          onAdd={handleAdd}
          onViewItem={handleView}
          onEditItem={handleEdit}
          onPublishItem={handlePublishItem}
          onUnpublishItem={handleUnpublishItem}
          onDeleteItem={handleDeleteItem}
          emptyStateTitle="No Terms & Conditions Yet"
          emptyStateSubtitle="Add your first terms & conditions document to get started."
          emptyStateActionLabel="Add New Terms"
        />
      

      {/* View modal */}
      <DocumentViewModal
        open={viewState !== null}
        title={viewState?.item.title ?? ""}
        content={viewState?.item.content ?? ""}
        modalSubtitle="How the Terms appear on the website"
        onClose={() => setViewState(null)}
        onEdit={() => handleEdit(viewState!.item)}
      />

      {/* Add modal */}
      <DocumentFormModal
        open={addOpen}
        mode="add"
        modalTitleAdd="Add New Terms & Conditions"
        modalTitleEdit="Edit Terms & Conditions"
        modalSubtitleAdd="Create a new Terms that will appear to visitors on the website."
        modalSubtitleEdit="Update the Terms & Conditions content displayed to website"
        titleLabel="Terms & Conditions Title"
        titlePlaceholder="Enter title here"
        editorPlaceholder="Write your Terms & Conditions content here...."
        onClose={() => setAddOpen(false)}
        onSave={(title, content, published) => {
          setAddOpen(false);
          handleSave(title, content, published, "add");
        }}
      />

      {/* Edit modal */}
      <DocumentFormModal
        open={editState !== null}
        mode="edit"
        initialData={editState ? { title: editState.title, content: editState.content, status: editState.status as "Unpublished" | "Published" } : undefined}
        modalTitleAdd="Add New Terms & Conditions"
        modalTitleEdit="Edit Terms & Conditions"
        modalSubtitleAdd="Create a new Terms that will appear to visitors on the website."
        modalSubtitleEdit="Update the Terms & Conditions content displayed to website"
        titleLabel="Terms & Conditions Title"
        titlePlaceholder="Enter title here"
        editorPlaceholder="Write your Terms & Conditions content here...."
        onClose={() => setEditState(null)}
        onSave={(title, content, published) => {
          setEditState(null);
          handleSave(title, content, published, "edit");
        }}
      />

      {/* Success */}
      {saveSuccessOpen && (
        <SuccessModal
          title={saveMode === "add" ? "Published Successfully" : "Terms & Conditions Updated Successfully"}
          message={
            saveMode === "add"
              ? "The Terms & Conditions have been published successfully and are now live on the website. Visitors can view the latest updated version at any time"
              : "The Terms & Conditions have been published successfully and are now live on the website. Visitors can view the latest updated version at any time"
          }
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
        title="Delete Terms & Conditions?"
        message="Are you sure you want to delete these Terms & Conditions? This action cannot be undone and the content will be permanently removed from the system"
        cancelLabel="Back"
        confirmLabel="Delete"
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
