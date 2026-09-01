"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  rawTranslations: section.translations,
});

export default function PrivacyPolicyPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");
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
      const is_active = statusFilter === "Published" ? true : statusFilter === "Unpublished" ? false : undefined;
      const res = await getAdminPrivacySections({ limit: 1000, search: searchQuery, is_active });
      return res.results.map(mapSectionToContentItem);
    },
    createItem: async (translations, published) => {
      const res = await createAdminPrivacySection({
        translations,
        is_active: published,
        order: 0,
      });
      return mapSectionToContentItem(res);
    },
    updateItem: async (id, translations, published) => {
      const res = await updateAdminPrivacySection(id, {
        translations,
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
    dependencies: [searchQuery, statusFilter],
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
        rawTranslations={viewState?.item.rawTranslations}
        modalSubtitle="How the Privacy Policy will appear on the website"
        onClose={() => setViewState(null)}
        onEdit={() => handleEdit(viewState!.item)}
      />

      {/* Add modal */}
      {/* Form modal */}
      <DocumentFormModal
        open={addOpen || !!editState}
        mode={editState ? "edit" : "add"}
        initialData={editState ? { 
          title: editState.title, 
          content: editState.content, 
          status: editState.status as "Unpublished" | "Published",
          rawTranslations: editState.rawTranslations 
        } : undefined}
        modalTitleAdd="Add Privacy Section"
        modalTitleEdit="Edit Privacy Section"
        modalSubtitleAdd="Create a new section for the privacy policy."
        modalSubtitleEdit="Update the content of this privacy section."
        titleLabel="Section Title"
        titlePlaceholder="e.g. Information Collection"
        editorPlaceholder="Write your Privacy Policy content here...."
        showColorPicker={true}
        onClose={() => {
          setAddOpen(false);
          setEditState(null);
        }}
        onSave={(translations, published) => {
          handleSave(translations, published, editState ? "edit" : "add");
          setAddOpen(false);
          setEditState(null);
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
