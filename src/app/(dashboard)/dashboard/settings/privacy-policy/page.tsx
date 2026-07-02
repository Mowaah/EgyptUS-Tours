"use client";

import { useRef } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ContentGrid, { type ContentItem } from "@/components/dashboard/ContentGrid/ContentGrid";
import DocumentViewModal from "@/components/dashboard/DocumentViewModal/DocumentViewModal";
import DocumentFormModal from "@/components/dashboard/DocumentFormModal/DocumentFormModal";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import { useContentManager } from "@/hooks/useContentManager";
import styles from "../../page.module.scss";

// Dummy data for visual — swap with real API data later
const INITIAL_DATA: ContentItem[] = [
  { id: "1", title: "Data Collection", content: "We collect personal information such as your name, email address, phone number, and payment details when you create an account, make a booking, or interact with our website. Non-personal information, like IP addresses and browser types, is also collected to improve site performance and user experience.\n\nYour data is used strictly for processing bookings, communicating updates, and offering personalized recommendations. We use industry-standard encryption to protect your information and ensure secure transactions.", status: "Unpublished", lastUpdated: "May 13, 2026" },
  { id: "2", title: "Children Policy", content: "Children are warmly welcomed at our hotels and trips. Policies regarding age limits, extra beds, and meal options may vary depending on the hotel or tour selected.\n\n<span style=\"color: #FF6600\">Infants (0-2 years):</span>\nGenerally stay free of charge; cribs may be available upon request.\n\n<span style=\"color: #FF6600\">Children (3-11 years):</span>\nMay incur a reduced rate for accommodation and meals.", status: "Published", lastUpdated: "May 13, 2026" },
];

export default function PrivacyPolicyPage() {
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
    itemName: "Privacy Policy",
  });

  return (
    <>
      
      
        <DashboardNavbar onPrimaryAction={handleAdd} />
        <ContentGrid
          ref={contentGridRef}
          title="Privacy Policy"
          ariaLabel="Privacy Policy Content"
          iconSrc="/images/dashboard/sidebar/privacy.svg"
          items={data}
          onAdd={handleAdd}
          onViewItem={handleView}
          onEditItem={handleEdit}
          onPublishItem={handlePublishItem}
          onUnpublishItem={handleUnpublishItem}
          onDeleteItem={handleDeleteItem}
          emptyStateTitle="No Privacy Policy Yet"
          emptyStateSubtitle="Add your first privacy policy document to get started."
          emptyStateActionLabel="Add New Privacy Policy"
        />
      

      {/* View modal */}
      <DocumentViewModal
        open={viewState !== null}
        title={viewState?.item.title ?? ""}
        content={viewState?.item.content ?? ""}
        modalSubtitle="How the Privacy Policy will appear on the website"
        onClose={() => setViewState(null)}
        onEdit={() => handleEdit(viewState!.item)}
      />

      {/* Add modal */}
      <DocumentFormModal
        open={addOpen}
        mode="add"
        modalTitleAdd="Add New Privacy Policy"
        modalTitleEdit="Edit Privacy Policy"
        modalSubtitleAdd="Create a new Privacy Policy that will appear to visitors on the website."
        modalSubtitleEdit="Update the Privacy Policy content displayed to website"
        titleLabel="Privacy Policy Title"
        titlePlaceholder="Enter title here"
        editorPlaceholder="Write your Privacy Policy content here...."
        showColorPicker={true}
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
        modalTitleAdd="Add New Privacy Policy"
        modalTitleEdit="Edit Privacy Policy"
        modalSubtitleAdd="Create a new Privacy Policy that will appear to visitors on the website."
        modalSubtitleEdit="Update the Privacy Policy content displayed to website"
        titleLabel="Privacy Policy Title"
        titlePlaceholder="Enter title here"
        editorPlaceholder="Write your Privacy Policy content here...."
        showColorPicker={true}
        onClose={() => setEditState(null)}
        onSave={(title, content, published) => {
          setEditState(null);
          handleSave(title, content, published, "edit");
        }}
      />

      {/* Success */}
      {saveSuccessOpen && (
        <SuccessModal
          title={saveMode === "add" ? "Published Successfully" : "Privacy Policy Updated Successfully"}
          message={
            saveMode === "add"
              ? "The Privacy Policy has been published successfully and is now live on the website. Visitors can view the latest updated version at any time."
              : "The Privacy Policy has been updated successfully and is now live on the website. Visitors can view the latest updated version at any time."
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
        title="Delete Privacy Policy?"
        message="Are you sure you want to delete this Privacy Policy? This action cannot be undone and the content will be permanently removed from the system."
        cancelLabel="Back"
        confirmLabel="Delete"
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
