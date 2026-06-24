"use client";

import { useState } from "react";
import DashboardTabs from "@/components/shared/DashboardTabs/DashboardTabs";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import { InquiriesPanel } from "./InquiriesPanel";
import { ImportLeadsPanel } from "./ImportLeadsPanel/ImportLeadsPanel";
import { LeadSummaryGrid } from "./LeadSummaryGrid";
import { AddNewLeadModal } from "./AddNewLeadModal";
import styles from "./LeadsInquiries.module.scss";

export default function LeadsInquiries() {
  const [activeTab, setActiveTab] = useState("leads");
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);

  const handlePrimaryAction = () => {
    if (activeTab === "leads") {
      setEditingLead(null);
      setIsAddLeadModalOpen(true);
    } else if (activeTab === "import") {
      // Logic for importing lead CSV would go here
      console.log("Import Lead CSV clicked");
    }
  };

  const handleEditLead = (lead: any) => {
    // Map table row data to form data format
    const sourceArray = lead.source ? [lead.source.toLowerCase().replace(/[\s-]/g, "_")] : [];
    
    setEditingLead({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: sourceArray,
      jobTitle: "Sample Job Title", // These fields aren't in the table currently, but would be in a real app
      companyName: "Sample Company",
      linkedin: "",
      website: "",
      notes: ""
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
      />
      
      <div className={styles.page}>
        <DashboardStatusBanner 
          show={showSuccessBanner} 
          onClose={() => setShowSuccessBanner(false)} 
          message={editingLead ? "The lead has been updated successfully" : "The new lead has been added successfully"} 
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
            <InquiriesPanel onEditLead={handleEditLead} />
          </>
        )}
        
        {activeTab === "import" && (
          <ImportLeadsPanel />
        )}
      </div>

      <AddNewLeadModal 
        open={isAddLeadModalOpen} 
        onClose={() => setIsAddLeadModalOpen(false)} 
        isEdit={!!editingLead}
        initialData={editingLead || undefined}
        onSuccess={() => {
          setIsAddLeadModalOpen(false);
          setShowSuccessBanner(true);
        }}
      />
    </>
  );
}
