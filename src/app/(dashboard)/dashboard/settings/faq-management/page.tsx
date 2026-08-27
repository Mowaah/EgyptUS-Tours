"use client";

import { useState } from "react";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ContentGrid, { type ContentItem } from "@/components/dashboard/ContentGrid/ContentGrid";
import FaqViewModal from "@/components/dashboard/FaqViewModal/FaqViewModal";
import FaqFormModal from "@/components/dashboard/FaqFormModal/FaqFormModal";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import DashboardConfirmationModal from "@/components/dashboard/shared/DashboardConfirmationModal/DashboardConfirmationModal";
import { useContentManager } from "@/hooks/useContentManager";
import { getAdminFaqs, createAdminFaq, updateAdminFaq, deleteAdminFaq, type AdminSiteFaq } from "@/services/admin/adminLegalService";

const mapFaqToContentItem = (faq: AdminSiteFaq): ContentItem => ({
  id: faq.id.toString(),
  title: faq.translations?.en?.question || "",
  content: faq.translations?.en?.answer || "",
  status: faq.is_active ? "Published" : "Unpublished",
  lastUpdated: new Date(faq.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  rawTranslations: faq.translations,
});

export default function FaqManagementPage() {
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
    itemName: "FAQ",
    fetchData: async () => {
      const res = await getAdminFaqs({ limit: 1000, search: searchQuery });
      return res.results.map(mapFaqToContentItem);
    },
    createItem: async (translations, published) => {
      const res = await createAdminFaq({
        translations,
        is_active: published,
        order: 0, // Backend logic can handle default ordering
      });
      return mapFaqToContentItem(res);
    },
    updateItem: async (id, translations, published) => {
      const res = await updateAdminFaq(id, {
        translations,
        is_active: published,
      });
      return mapFaqToContentItem(res);
    },
    deleteItemApi: async (id) => {
      await deleteAdminFaq(id);
    },
    updateStatus: async (id, published) => {
      await updateAdminFaq(id, { is_active: published });
    },
    dependencies: [searchQuery],
  });

  return (
    <>
      
      
        <DashboardNavbar 
          onPrimaryAction={() => setAddOpen(true)} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <ContentGrid 
          ref={contentGridRef}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
          loading={loading}
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
        rawTranslations={viewState?.item.rawTranslations}
        onClose={() => setViewState(null)}
        onEdit={() => handleEdit(viewState!.item)}
      />

      {/* Add modal */}
      {/* Form modal */}
      <FaqFormModal
        open={addOpen || !!editState}
        mode={editState ? "edit" : "add"}
        initialData={editState ? { 
          question: editState.title, 
          answer: editState.content, 
          status: editState.status as "Unpublished" | "Published",
          rawTranslations: editState.rawTranslations 
        } : undefined}
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

