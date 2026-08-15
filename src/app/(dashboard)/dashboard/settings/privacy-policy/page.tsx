"use client";

import { useRef, useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ContentGrid, { type ContentItem } from "@/components/dashboard/ContentGrid/ContentGrid";
import DocumentViewModal from "@/components/dashboard/DocumentViewModal/DocumentViewModal";
import DocumentFormModal from "@/components/dashboard/DocumentFormModal/DocumentFormModal";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import { useContentManager } from "@/hooks/useContentManager";
import { getAdminPrivacySections, createAdminPrivacySection, updateAdminPrivacySection, deleteAdminPrivacySection, type AdminLegalSection } from "@/services/admin/adminLegalService";
import styles from "../../page.module.scss";

const mapSectionToContentItem = (section: AdminLegalSection): ContentItem => ({
  id: section.id.toString(),
  title: section.translations?.en?.title || "",
  content: section.translations?.en?.content || "",
  status: section.is_active ? "Published" : "Unpublished",
  lastUpdated: new Date(section.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
});

export default function PrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    contentGridRef,
    data,
    loading,
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
    itemName: "Privacy Policy",
    fetchData: async () => {
      const res = await getAdminPrivacySections({ limit: 1000, search: searchQuery });
      return res.results.map(mapSectionToContentItem);
    },
    createItem: async (title, content, published) => {
      const res = await createAdminPrivacySection({
        translations: { en: { title, content } },
        is_active: published,
        order: 0,
      });
      return mapSectionToContentItem(res);
    },
    updateItem: async (id, title, content, published) => {
      const res = await updateAdminPrivacySection(id, {
        translations: { en: { title, content } },
        is_active: published,
      });
      return mapSectionToContentItem(res);
    },
    deleteItemApi: async (id) => {
      await deleteAdminPrivacySection(id);
    },
    updateStatus: async (id, published) => {
      await updateAdminPrivacySection(id, { is_active: published });
    },
    dependencies: [searchQuery],
  });

  return (
    <>
      
      
        <DashboardNavbar 
          onPrimaryAction={handleAdd} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <ContentGrid
          ref={contentGridRef}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
          loading={loading}
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
