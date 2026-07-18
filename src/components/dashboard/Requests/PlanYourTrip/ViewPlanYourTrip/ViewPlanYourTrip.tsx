"use client";

import React, { useState } from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import phStyles from "@/components/dashboard/shared/ProfileHeader/ProfileHeader.module.scss";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import ActionNoteModal, { ActionNoteModalConfig } from "@/components/dashboard/LeadsInquiries/ActionNoteModal/ActionNoteModal";
import { ReassignModal } from "@/components/dashboard/shared";
import { 
  CreateProposalModal, 
  MarkProposalSentModal, 
  RejectRequestModal, 
  ReopenRequestModal, 
  StartNegotiationModal, 
  UploadRevisedProposalModal 
} from "../../shared/Modals";
import { CustomerInformation, ProposalFile } from "../../shared/Sections";
import { getPlanYourTripDetails } from "../mockPlanYourTripData";
import TripPreferences from "./TripPreferences";
import TripDetails from "./TripDetails";
import ActivityTimeline from "./ActivityTimeline";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import { getStatusVariant } from "../planYourTripColumns";
import styles from "./ViewPlanYourTrip.module.scss";

const ADD_NOTE_CONFIG: ActionNoteModalConfig = {
  title: "Add Note",
  iconSrc: "/images/dashboard/inquiries/add_note.svg",
  label: "Note",
  primaryLabel: "Add Note",
  placeholder: "Write your note here...",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ViewPlanYourTrip({ requestId }: { requestId: string }) {
  const requestData = getPlanYourTripDetails(requestId);
  
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState("");

  const handleModalSubmit = (action: string) => {
    let successMessage = "";
    if (action === "add_note") {
      successMessage = "The Note has been added successfully";
    } else if (action === "assign") {
      successMessage = "The Request has been Re-Assigned to the selected employee";
    } else if (action === "create_proposal") {
      successMessage = "The Proposal Uploaded Successfully";
    } else if (action === "mark_proposal_sent") {
      successMessage = "Proposal marked as sent successfully";
    } else if (action === "mark_rejected") {
      successMessage = "The Request has been Rejected Successfully";
    } else if (action === "reopen") {
      successMessage = "The Request has been Reopened Successfully";
    } else if (action === "start_negotiation") {
      successMessage = "The request has been moved to the Negotiation stage";
    } else if (action === "upload_revised_proposal") {
      successMessage = "The Revised Proposal Uploaded Successfully";
    }
    
    setBannerMessage(successMessage);
    setActiveModalKey(null);
  };

  return (
    <>
      <DashboardNavbar
        breadcrumbTrail={[
          { label: "Requests" },
          { label: "Plan Your trip", href: "/dashboard/requests/plan-your-trip" },
          { label: requestData.id }
        ]}
      >
        <ProfileHeader
          title={`${requestData.name} - ${requestData.id}`}
          customPills={
            <StatusPill 
              label={requestData.status} 
              variant={getStatusVariant(requestData.status)} 
            />
          }
          subtitleElements={[requestData.date]}
          actionButtons={
            <>
              <button 
                className={phStyles.secondaryActionButton} 
                type="button" 
                onClick={() => setActiveModalKey("add_note")}
              >
                <Image src="/images/dashboard/inquiries/add_note.svg" alt="" width={20} height={20} />
                Add note
              </button>
              {requestData.status === "New" && (
                <button 
                  className={phStyles.secondaryActionButton} 
                  type="button" 
                  onClick={() => setActiveModalKey("assign")}
                >
                  <Image src="/images/dashboard/user-add.svg" alt="" width={20} height={20} />
                  Assign to Employee
                </button>
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
          <div className={styles.leftColumn}>
            <CustomerInformation request={requestData.customer} />
            <TripDetails request={requestData.details} />
            {(requestData.status === "Proposal Ready" || requestData.status === "Proposal Sent") && (
              <ProposalFile />
            )}
          </div>
          
          <div className={styles.rightColumn}>
            <TripPreferences request={requestData.preferences} />
            <ActivityTimeline />
          </div>
        </div>

        {requestData.status !== "New" && (
          <div className={styles.footer}>
            <div className={styles.footerDate}>
              Last Update: <br/> <strong>42/6/206</strong>
            </div>
            <div className={styles.footerActions}>
              {requestData.status === "Negotiation" ? (
                <>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("assign")}
                  >
                    <Image src="/images/dashboard/refresh.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("mark_rejected")}
                  >
                    <Image src="/images/dashboard/cancel.svg" alt="" width={20} height={20} />
                    Mark as Rejected
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("upload_revised_proposal")}
                  >
                    <Image src="/images/dashboard/upload.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                    Upload Revised Proposal
                  </button>
                </>
              ) : requestData.status === "Rejected" ? (
                <button
                  className={styles.createProposalBtn}
                  type="button"
                  onClick={() => setActiveModalKey("reopen")}
                >
                  <Image src="/images/dashboard/refresh.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                  Reopen Request
                </button>
              ) : requestData.status === "Proposal Sent" ? (
                <>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("assign")}
                  >
                    <Image src="/images/dashboard/refresh.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("mark_rejected")}
                  >
                    <Image src="/images/dashboard/cancel.svg" alt="" width={20} height={20} />
                    Mark as Rejected
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("start_negotiation")}
                  >
                    <Image src="/images/dashboard/send.svg" alt="" width={20} height={20} />
                    Start Negotiation
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                  >
                    <Image src="/images/dashboard/inquiries/mark_complete.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                    Mark as Approved
                  </button>
                </>
              ) : requestData.status === "Proposal Ready" ? (
                <>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("assign")}
                  >
                    <Image src="/images/dashboard/refresh.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("mark_proposal_sent")}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.whiteIcon}>
                      <path d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Mark proposal as sent
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("assign")}
                  >
                    <Image src="/images/dashboard/refresh.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("create_proposal")}
                  >
                    <Image src="/images/dashboard/send.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                    Create Proposal
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <ActionNoteModal 
        open={activeModalKey === "add_note"}
        config={ADD_NOTE_CONFIG}
        onClose={() => setActiveModalKey(null)} 
        onSubmit={() => handleModalSubmit("add_note")} 
      />
      
      <ReassignModal
        open={activeModalKey === "assign"}
        onClose={() => setActiveModalKey(null)}
        onConfirm={() => handleModalSubmit("assign")}
        showReasonField={requestData.status !== "New"}
        title={requestData.status === "New" ? "Assign to Employee" : "Re-Assign to Employee"}
        subtitle=""
      />

      <CreateProposalModal
        open={activeModalKey === "create_proposal"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("create_proposal")}
      />

      <MarkProposalSentModal
        open={activeModalKey === "mark_proposal_sent"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("mark_proposal_sent")}
      />

      <RejectRequestModal
        open={activeModalKey === "mark_rejected"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("mark_rejected")}
      />

      <ReopenRequestModal
        open={activeModalKey === "reopen"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("reopen")}
      />

      <StartNegotiationModal
        open={activeModalKey === "start_negotiation"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("start_negotiation")}
      />

      <UploadRevisedProposalModal
        open={activeModalKey === "upload_revised_proposal"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("upload_revised_proposal")}
      />
    </>
  );
}
