"use client";

import { useState } from "react";
import DashboardTabs from "@/components/dashboard/shared/DashboardTabs/DashboardTabs";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import SuccessModal from "@/components/shared/SuccessModal/SuccessModal";
import { InquiriesPanel } from "./InquiriesPanel";
import { ImportLeadsPanel } from "./ImportLeadsPanel/ImportLeadsPanel";
import { LeadSummaryGrid } from "./LeadSummaryGrid";
import { AddNewLeadModal } from "./AddNewLeadModal";
import { ImportLeadsModal } from "./ImportLeadsPanel/ImportLeadsModal";
import styles from "./LeadsInquiries.module.scss";

export default function LeadsInquiries() {
  const [activeTab, setActiveTab] = useState("leads");
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImportSuccessOpen, setIsImportSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingLead, setEditingLead] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePrimaryAction = () => {
    if (activeTab === "leads") {
      setEditingLead(null);
      setIsAddLeadModalOpen(true);
    } else if (activeTab === "import") {
      setIsImportModalOpen(true);
    }
  };

  const handleEditLead = (lead: any) => {
    setEditingLead({
      id: lead.id,
      name: lead.full_name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      jobTitle: lead.job_title || "",
      companyName: lead.company_name || "",
      linkedin: lead.linkedin_url || "",
      website: lead.website || "",
      notes: "" // Notes are loaded via timeline
    });
    setIsAddLeadModalOpen(true);
  };

  const primaryActionConfig = activeTab === "leads"
    ? { label: "Add New Lead", iconSrc: "/images/dashboard/navbar/add-circle.svg" }
    : { label: "Import Lead CSV", iconSrc: "/images/dashboard/export2.svg" };

  return (
    <>
      <DashboardNavbar 
        primaryAction={primaryActionConfig} 
        onPrimaryAction={handlePrimaryAction} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className={styles.page}>
        <DashboardStatusBanner 
          show={!!successMessage} 
          onClose={() => setSuccessMessage("")} 
          message={successMessage} 
          className={styles.toastBanner}
        />
        
        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: "leads", label: "Leads", iconSrc: "/images/dashboard/inquiries/people.svg" },
            { id: "import", label: "Import Leads", iconSrc: "/images/dashboard/inquiries/inquiries.svg" },
          ]}
        />
        
        {activeTab === "leads" && (
          <>
            <LeadSummaryGrid />
            <InquiriesPanel 
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
              onEditLead={handleEditLead} 
              onAddLead={() => setIsAddLeadModalOpen(true)}
            />
          </>
        )}
        
        {activeTab === "import" && (
          <ImportLeadsPanel 
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery("")}
            onReassignSuccess={() => setSuccessMessage("The lead has been reassigned successfully")}
            onDeleteSuccess={() => setSuccessMessage("The selected batches have been deleted successfully")}
            onImportLead={() => setIsImportModalOpen(true)}
          />
        )}
      </div>

      <AddNewLeadModal 
        open={isAddLeadModalOpen} 
        onClose={() => setIsAddLeadModalOpen(false)} 
        isEdit={!!editingLead}
        initialData={editingLead || undefined}
        onSuccess={() => {
          setIsAddLeadModalOpen(false);
          setSuccessMessage(editingLead ? "The lead has been updated successfully" : "The new lead has been added successfully");
        }}
      />

      <ImportLeadsModal 
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          setIsImportModalOpen(false);
          setIsImportSuccessOpen(true);
        }}
      />

      {isImportSuccessOpen && (
        <SuccessModal
          title="Leads Assigned Successfully"
          message="480 leads have been assigned successfully."
          buttonText="Close"
          primaryButtonText="Go to Leads"
          onClose={() => setIsImportSuccessOpen(false)}
          onPrimaryClick={() => {
            setIsImportSuccessOpen(false);
            setActiveTab("leads");
          }}
          metadata={[
            { label: "Assigned To", value: "Sales & Operation", valueColor: "#0E2851" },
            { label: "Team Members", value: "4", valueColor: "#0E2851" }
          ]}
        />
      )}
    </>
  );
}
