"use client";

import { useState, useRef } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import ContentGrid, { type ContentItem, type ContentGridRef } from "@/components/dashboard/ContentGrid/ContentGrid";
import DocumentViewModal from "@/components/dashboard/DocumentViewModal/DocumentViewModal";
import DocumentFormModal from "@/components/dashboard/DocumentFormModal/DocumentFormModal";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import styles from "../../page.module.scss";

// Dummy data for visual — swap with real API data later
const PRIVACY_DATA: ContentItem[] = [
  { id: "1", title: "Data Collection Policy", content: "We collect information to provide better services to our users. We do not sell your personal data. The privacy policy explains how we treat your personal data and protect your privacy when you use our Services.", status: "Published", lastUpdated: "May 13, 2026" },
  { id: "2", title: "Children Policy", content: "Children are warmly welcomed at our hotels and trips. Policies regarding age limits, extra beds, and meal options may vary depending on the hotel or tour selected.\n\n<span style=\"color: #FF6600\">Infants (0-2 years):</span>\nGenerally stay free of charge; cribs may be available upon request.\n\n<span style=\"color: #FF6600\">Children (3-11 years):</span>\nMay incur a reduced rate for accommodation and meals.", status: "Published", lastUpdated: "May 13, 2026" },
];

type ViewState = { item: ContentItem; index: number } | null;
type EditState = ContentItem | null;

export default function PrivacyPolicyPage() {
  const contentGridRef = useRef<ContentGridRef>(null);

  // Modal state
  const [viewState, setViewState] = useState<ViewState>(null);
  const [editState, setEditState] = useState<EditState>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);
  const [saveMode, setSaveMode] = useState<"add" | "edit">("add");

  const handleView = (item: ContentItem, index: number) => setViewState({ item, index });

  const handleEdit = (item: ContentItem) => {
    setViewState(null);
    setEditState(item);
  };

  const handleAdd = () => setAddOpen(true);

  const handleSave = (mode: "add" | "edit") => {
    setSaveMode(mode);
    setSaveSuccessOpen(true);
  };

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Privacy Policy Management">
        <DashboardNavbar onPrimaryAction={handleAdd} />
        <ContentGrid
          ref={contentGridRef}
          title="Privacy Policy"
          ariaLabel="Privacy Policy Content"
          iconSrc="/images/dashboard/sidebar/privacy.svg"
          items={PRIVACY_DATA}
          onAdd={handleAdd}
          onViewItem={handleView}
          onEditItem={handleEdit}
          emptyStateTitle="No Privacy Policy Yet"
          emptyStateSubtitle="Add your first privacy policy document to get started."
          emptyStateActionLabel="Add New Privacy Policy"
        />
      </section>

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
        onSave={() => {
          setAddOpen(false);
          handleSave("add");
        }}
      />

      {/* Edit modal */}
      <DocumentFormModal
        open={editState !== null}
        mode="edit"
        initialData={editState ? { title: editState.title, content: editState.content, status: editState.status as "Draft" | "Published" } : undefined}
        modalTitleAdd="Add New Privacy Policy"
        modalTitleEdit="Edit Privacy Policy"
        modalSubtitleAdd="Create a new Privacy Policy that will appear to visitors on the website."
        modalSubtitleEdit="Update the Privacy Policy content displayed to website"
        titleLabel="Privacy Policy Title"
        titlePlaceholder="Enter title here"
        editorPlaceholder="Write your Privacy Policy content here...."
        showColorPicker={true}
        onClose={() => setEditState(null)}
        onSave={() => {
          setEditState(null);
          handleSave("edit");
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
    </main>
  );
}
