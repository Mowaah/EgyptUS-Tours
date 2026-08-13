"use client";

import React from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import phStyles from "@/components/dashboard/shared/ProfileHeader/ProfileHeader.module.scss";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import pageStyles from "@/app/(dashboard)/dashboard/page.module.scss";
import styles from "./ViewLead.module.scss";
import CustomerInformation from "./CustomerInformation";
import ActivityTimeline from "./ActivityTimeline";
import ActionNoteModal, { ActionNoteModalConfig } from "../ActionNoteModal/ActionNoteModal";
import { 
  useLead, 
  useCloseLead, 
  useAddLeadNote, 
  useMarkLeadContacted, 
  useMarkLeadQualified, 
  useConvertLead, 
  useReopenLead 
} from "@/hooks/useLeads";
import type { AdminLead } from "@/types/adminLeadTypes";

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
  const numericId = parseInt(leadId, 10);
  const { data: lead, isLoading } = useLead(numericId);
  
  const [activeModalKey, setActiveModalKey] = React.useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = React.useState("");

  const addNoteMutation = useAddLeadNote();
  const closeLeadMutation = useCloseLead();
  const markContactedMutation = useMarkLeadContacted();
  const markQualifiedMutation = useMarkLeadQualified();
  const convertLeadMutation = useConvertLead();
  const reopenLeadMutation = useReopenLead();

  if (isLoading || !lead) {
    return <div>Loading lead...</div>;
  }

  const activeModalConfig = activeModalKey ? MODAL_CONFIGS[activeModalKey] : null;

  return (
    <>
            
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Leads Management", href: "/dashboard/leads" },
            { label: lead.display_id }
          ]}
        >
          <ProfileHeader
            title={`${lead.full_name} - ${lead.display_id}`}
            pillLabel={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            pillVariant={
              lead.status === "contacted" ? "orange" :
              lead.status === "qualified" ? "purple" :
              lead.status === "converted" ? "green" :
              lead.status === "closed" ? "red" : "blue"
            }
            subtitleElements={[`Created on ${new Date(lead.created_at).toLocaleDateString()}`]}
            actionButtons={
              <>
                {(lead.status === "new" || lead.status === "contacted" || lead.status === "qualified") && (
                  <>
                    <button className={phStyles.dangerActionButton} type="button" onClick={() => setActiveModalKey("close_lead")}>
                      <Image src="/images/dashboard/inquiries/close_lead.svg" alt="" width={20} height={20} />
                      Close Lead
                    </button>

                    <button className={phStyles.secondaryActionButton} type="button" onClick={() => setActiveModalKey("add_note")}>
                      <Image src="/images/dashboard/inquiries/add_note.svg" alt="" width={20} height={20} />
                      Add note
                    </button>

                    {lead.status === "new" && (
                      <button className={phStyles.secondaryActionButton} type="button" onClick={() => setActiveModalKey("mark_contacted")}>
                        <Image src="/images/dashboard/inquiries/mark_complete.svg" alt="" width={20} height={20} />
                        Mark As Contacted
                      </button>
                    )}

                    {lead.status === "contacted" && (
                      <button className={phStyles.secondaryActionButton} type="button" onClick={() => setActiveModalKey("mark_qualified")}>
                        <Image src="/images/dashboard/inquiries/mark_complete.svg" alt="" width={20} height={20} />
                        Mark As Qualified
                      </button>
                    )}

                    {lead.status === "qualified" && (
                      <button className={phStyles.secondaryActionButton} type="button" onClick={() => setActiveModalKey("convert_lead")}>
                        <Image src="/images/dashboard/inquiries/convert_lead.svg" alt="" width={20} height={20} />
                        Convert Lead
                      </button>
                    )}
                  </>
                )}

                {lead.status === "converted" && (
                  <button className={phStyles.primaryActionButton} type="button">
                    View Request
                    <Image src="/images/dashboard/fields/eye.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                  </button>
                )}

                {lead.status === "closed" && (
                  <>
                    <button className={phStyles.secondaryActionButton} type="button" onClick={() => setActiveModalKey("add_note")}>
                      <Image src="/images/dashboard/inquiries/add_note.svg" alt="" width={20} height={20} />
                      Add note
                    </button>

                    <button className={phStyles.secondaryActionButton} type="button" onClick={() => setActiveModalKey("reopen_lead")}>
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
            <ActivityTimeline leadId={numericId} />
          </div>
        </div>
      

      <ActionNoteModal 
        open={!!activeModalConfig}
        config={activeModalConfig}
        onClose={() => setActiveModalKey(null)} 
        onSubmit={(note) => {
          if (!activeModalKey) return;
          
          let successMessage = "";
          const handleSuccess = () => {
            setBannerMessage(successMessage);
            setActiveModalKey(null);
          };

          switch (activeModalKey) {
            case "add_note":
              successMessage = "The note has been added successfully.";
              addNoteMutation.mutate({ id: numericId, note }, { onSuccess: handleSuccess });
              break;
            case "close_lead":
              successMessage = "The lead has been closed successfully";
              closeLeadMutation.mutate({ id: numericId, reason: note }, { onSuccess: handleSuccess });
              break;
            case "mark_contacted":
              successMessage = "The lead status has been contacted successfully";
              markContactedMutation.mutate({ id: numericId, note }, { onSuccess: handleSuccess });
              break;
            case "mark_qualified":
              successMessage = "The lead has been marked as qualified successfully";
              markQualifiedMutation.mutate({ id: numericId, note }, { onSuccess: handleSuccess });
              break;
            case "convert_lead":
              successMessage = "The lead has been converted to a request successfully";
              convertLeadMutation.mutate({ id: numericId, note }, { onSuccess: handleSuccess });
              break;
            case "reopen_lead":
              successMessage = "The lead has been re-opened successfully";
              reopenLeadMutation.mutate({ id: numericId, reason: note }, { onSuccess: handleSuccess });
              break;
          }
        }} 
      />
    </>
  );
}
