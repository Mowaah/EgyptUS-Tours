"use client";

import React from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import pageStyles from "@/app/(dashboard)/dashboard/page.module.scss";
import styles from "./ViewLead.module.scss";
import CustomerInformation from "./CustomerInformation";
import ActivityTimeline from "./ActivityTimeline";
import ActionNoteModal, { ActionNoteModalConfig } from "../ActionNoteModal/ActionNoteModal";
import { mockLeads } from "../leadsInquiriesData";
import { LeadRow } from "../types";

const MODAL_CONFIGS: Record<string, ActionNoteModalConfig> = {
  add_note: {
    title: "Add Note",
    iconSrc: "/images/dashboard/inquiries/add_note.svg",
    label: "Note",
    primaryLabel: "Add Note",
    placeholder: "Write your note here...",
  },
  mark_contacted: {
    title: "Mark as Contacted",
    iconSrc: "/images/dashboard/inquiries/mark_complete.svg",
    label: "Contact Note",
    primaryLabel: "Mark as Contacted",
    placeholder: "Write your note here...",
  },
  mark_qualified: {
    title: "Mark As Qualified",
    iconSrc: "/images/dashboard/inquiries/mark_complete.svg",
    label: "Qualified Note",
    primaryLabel: "Mark as Qualified",
    placeholder: "Write your note here...",
  },
  convert_lead: {
    title: "Converted lead to Request",
    iconSrc: "/images/dashboard/inquiries/convert_lead.svg",
    label: "Convert Note",
    primaryLabel: "Convert Lead",
    placeholder: "Write your note here...",
  },
  reopen_lead: {
    title: "Re-open Lead",
    iconSrc: "/images/dashboard/inquiries/re-open_lead.svg",
    label: "Reason for Reopening",
    primaryLabel: "Re-open Lead",
    placeholder: "Write your reason here...",
  },
  close_lead: {
    title: "Close Lead",
    subtitle: "Please confirm that you want to close this lead...",
    iconSrc: "/images/dashboard/inquiries/close_lead.svg",
    label: "Reason for Closing",
    primaryLabel: "Close Lead",
    placeholder: "Enter the reason for closing this lead...",
    isDanger: true,
  },
};

interface ViewLeadProps {
  leadId: string;
}

export default function ViewLead({ leadId }: ViewLeadProps) {
  const lead: LeadRow = mockLeads.find((l) => l.id === leadId) || {
    id: leadId,
    name: "Ahmed Hassan",
    email: "ahmed.hassan@nilehorizonevents.com",
    phone: "+20 109 458 7721",
    source: "Email",
    date: "2024-10-26",
    status: "New",
    agent: "Sara M.",
  };
  
  const [activeModalKey, setActiveModalKey] = React.useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = React.useState("");

  const activeModalConfig = activeModalKey ? MODAL_CONFIGS[activeModalKey] : null;

  return (
    <>
            
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Leads Management", href: "/dashboard/leads" },
            { label: lead.id }
          ]}
        >
          <ProfileHeader
            title={`${lead.name} - ${lead.id}`}
            pillLabel={lead.status}
            pillVariant={
              lead.status === "Contacted" ? "orange" :
              lead.status === "Qualified" ? "purple" :
              lead.status === "Converted" ? "green" :
              lead.status === "Closed" ? "red" : "blue"
            }
            subtitleElements={["April 10, 2025 at 1:20 PM"]}
            actionButtons={
              <>
                {(lead.status === "New" || lead.status === "Contacted" || lead.status === "Qualified") && (
                  <>
                    <button className={`${styles.actionButton} ${styles.dangerButton}`} type="button" onClick={() => setActiveModalKey("close_lead")}>
                      <Image src="/images/dashboard/inquiries/close_lead.svg" alt="" width={20} height={20} />
                      Close Lead
                    </button>

                    <button className={styles.actionButton} type="button" onClick={() => setActiveModalKey("add_note")}>
                      <Image src="/images/dashboard/inquiries/add_note.svg" alt="" width={20} height={20} />
                      Add note
                    </button>

                    {lead.status === "New" && (
                      <button className={styles.actionButton} type="button" onClick={() => setActiveModalKey("mark_contacted")}>
                        <Image src="/images/dashboard/inquiries/mark_complete.svg" alt="" width={20} height={20} />
                        Mark As Contacted
                      </button>
                    )}

                    {lead.status === "Contacted" && (
                      <button className={styles.actionButton} type="button" onClick={() => setActiveModalKey("mark_qualified")}>
                        <Image src="/images/dashboard/inquiries/mark_complete.svg" alt="" width={20} height={20} />
                        Mark As Qualified
                      </button>
                    )}

                    {lead.status === "Qualified" && (
                      <button className={styles.actionButton} type="button" onClick={() => setActiveModalKey("convert_lead")}>
                        <Image src="/images/dashboard/inquiries/convert_lead.svg" alt="" width={20} height={20} />
                        Convert Lead
                      </button>
                    )}
                  </>
                )}

                {lead.status === "Converted" && (
                  <button className={`${styles.actionButton} ${styles.primaryButton}`} type="button">
                    View Request
                    <Image src="/images/dashboard/fields/eye.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                  </button>
                )}

                {lead.status === "Closed" && (
                  <>
                    <button className={styles.actionButton} type="button" onClick={() => setActiveModalKey("add_note")}>
                      <Image src="/images/dashboard/inquiries/add_note.svg" alt="" width={20} height={20} />
                      Add note
                    </button>

                    <button className={styles.actionButton} type="button" onClick={() => setActiveModalKey("reopen_lead")}>
                      <Image src="/images/dashboard/inquiries/re-open_lead.svg" alt="" width={20} height={20} />
                      Re-open Lead
                    </button>
                  </>
                )}
              </>
            }
          />
        </DashboardNavbar>

        <div className={styles.contentWrapper}>
          <DashboardStatusBanner 
            message={bannerMessage} 
            show={!!bannerMessage} 
            onClose={() => setBannerMessage("")} 
            className={styles.toastBanner}
          />
          <div className={styles.gridContainer}>
            <CustomerInformation lead={lead} />
            <ActivityTimeline />
          </div>
        </div>
      

      <ActionNoteModal 
        open={!!activeModalConfig}
        config={activeModalConfig}
        onClose={() => setActiveModalKey(null)} 
        onSubmit={(note) => {
          console.log(`Submitting ${activeModalKey}:`, note);
          
          let successMessage = "";
          switch (activeModalKey) {
            case "add_note":
              successMessage = "The note has been added successfully.";
              break;
            case "close_lead":
              successMessage = "The lead has been closed successfully";
              break;
            case "mark_contacted":
              successMessage = "The lead status has been contacted successfully";
              break;
            case "mark_qualified":
              successMessage = "The lead has been marked as qualified successfully";
              break;
            case "convert_lead":
              successMessage = "The lead has been converted to a request successfully";
              break;
            case "reopen_lead":
              successMessage = "The lead has been re-opened successfully";
              break;
          }
          
          if (successMessage) {
            setBannerMessage(successMessage);
          }
          
          setActiveModalKey(null);
        }} 
      />
    </>
  );
}
