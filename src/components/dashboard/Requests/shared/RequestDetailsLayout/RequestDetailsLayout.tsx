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
  UploadRevisedProposalModal,
  ApproveRequestModal,
  RecordDepositPaymentModal,
  RecordRemainingPaymentModal,
  RefundPaymentModal,
  CancelTripModal
} from "@/components/dashboard/Requests/shared/Modals";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import { getStatusVariant } from "../../PlanYourTrip/planYourTripColumns";
import styles from "./RequestDetailsLayout.module.scss";

const ADD_NOTE_CONFIG: ActionNoteModalConfig = {
  title: "Add Note",
  iconSrc: "/images/dashboard/inquiries/add_note.svg",
  label: "Note",
  primaryLabel: "Add Note",
  placeholder: "Write your note here...",
};

interface RequestDetailsLayoutProps {
  breadcrumbLabel: string;
  breadcrumbHref: string;
  requestTitle: string;
  status: string;
  date: string;
  leftColumnContent: React.ReactNode;
  rightColumnContent: React.ReactNode;
}

export default function RequestDetailsLayout({
  breadcrumbLabel,
  breadcrumbHref,
  requestTitle,
  status,
  date,
  leftColumnContent,
  rightColumnContent
}: RequestDetailsLayoutProps) {
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState("");

  const handleModalSubmit = (action: string) => {
    let successMessage = "";
    if (action === "add_note") {
      successMessage = "The Note has been added successfully";
    } else if (action === "assign") {
      successMessage = "The Request has been Re-Assigned to the selected employee";
    } else if (action === "create_proposal") {
      successMessage = "The Proposal uploaded successfully";
    } else if (action === "mark_proposal_sent") {
      successMessage = "Proposal marked as sent successfully";
    } else if (action === "mark_rejected") {
      successMessage = "The Request has been rejected successfully";
    } else if (action === "reopen") {
      successMessage = "The Request has been reopened successfully";
    } else if (action === "approve") {
      successMessage = "The Request has been Approved successfully";
    } else if (action === "record_deposit") {
      successMessage = "The Deposit Payment Recorded Successfully";
    } else if (action === "record_remaining") {
      successMessage = "The Remaining Payment Recorded Successfully";
    } else if (action === "start_negotiation") {
      successMessage = "The request has been moved to the Negotiation stage";
    } else if (action === "upload_revised_proposal") {
      successMessage = "The Revised Proposal uploaded successfully";
    } else if (action === "refund_payment") {
      successMessage = "The Refund Processed Successfully";
    } else if (action === "cancel_trip") {
      successMessage = "The Trip Cancelled Successfully";
    }
    
    setBannerMessage(successMessage);
    setActiveModalKey(null);
  };

  return (
    <>
      <DashboardNavbar
        breadcrumbTrail={[
          { label: "Requests" },
          { label: breadcrumbLabel, href: breadcrumbHref },
          { label: requestTitle.split(" - ")[1] || "Details" }
        ]}
      >
        <ProfileHeader
          title={requestTitle}
          customPills={
            <StatusPill 
              label={status} 
              variant={getStatusVariant(status)} 
            />
          }
          subtitleElements={[date]}
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
              {status === "New" && (
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
            {leftColumnContent}
          </div>
          
          <div className={styles.rightColumn}>
            {rightColumnContent}
          </div>
        </div>

        {status !== "New" && (
          <div className={styles.footer}>
            <div className={styles.footerDate}>
              Last Update: <br/> <strong>42/6/206</strong>
            </div>
            <div className={styles.footerActions}>
              {status === "Negotiation" ? (
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
              ) : status === "30% Pending Payment" ? (
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
                    onClick={() => setBannerMessage("Email reminder sent")}
                  >
                    <Image src="/images/dashboard/notification-bing.svg" alt="" width={20} height={20} />
                    Send Email Reminder
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("record_deposit")}
                  >
                    <Image src="/images/dashboard/finance/deposits.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                    Record Deposit Payment
                  </button>
                </>
              ) : status === "Deposit Paid" ? (
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
                    onClick={() => setActiveModalKey("cancel_trip")}
                  >
                    <Image src="/images/dashboard/cancel.svg" alt="" width={20} height={20} />
                    Cancel Trip
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setBannerMessage("Remaining payment reminder sent")}
                  >
                    <Image src="/images/dashboard/notification-bing.svg" alt="" width={20} height={20} />
                    Send Remaining Payment Reminder
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("record_remaining")}
                  >
                    <Image src="/images/dashboard/finance/deposits.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                    Record Remaining Payment
                  </button>
                </>
              ) : status === "Fully Paid" ? (
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
                    onClick={() => setActiveModalKey("cancel_trip")}
                  >
                    <Image src="/images/dashboard/cancel.svg" alt="" width={20} height={20} />
                    Cancel Trip
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setBannerMessage("The Trip Reminder send via email Successfully")}
                  >
                    <Image src="/images/dashboard/notification-bing.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                    Send Email Reminder
                  </button>
                </>
              ) : status === "In Trip" || status === "Refund Completed" ? (
                <></>
              ) : status === "Completed" ? (
                <button
                  className={styles.createProposalBtn}
                  type="button"
                  onClick={() => setBannerMessage("Customer Review Opened")}
                >
                  <Image src="/images/dashboard/reviews.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                  View Customer Review
                </button>
              ) : status === "Cancelled" ? (
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
                    onClick={() => setActiveModalKey("refund_payment")}
                  >
                    <Image src="/images/dashboard/refresh.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                    Refund Payment
                  </button>
                </>
              ) : status === "Rejected" ? (
                <button
                  className={styles.createProposalBtn}
                  type="button"
                  onClick={() => setActiveModalKey("reopen")}
                >
                  <Image src="/images/dashboard/refresh.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                  Reopen Request
                </button>
              ) : status === "Proposal Sent" ? (
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
                    onClick={() => setActiveModalKey("approve")}
                  >
                    <Image src="/images/dashboard/inquiries/mark_complete.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                    Mark as Approved
                  </button>
                </>
              ) : status === "Proposal Ready" ? (
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
        showReasonField={status !== "New"}
        title={status === "New" ? "Assign to Employee" : "Re-Assign to Employee"}
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

      <ApproveRequestModal
        open={activeModalKey === "approve"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("approve")}
      />

      <RecordDepositPaymentModal
        open={activeModalKey === "record_deposit"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("record_deposit")}
      />

      <RecordRemainingPaymentModal
        open={activeModalKey === "record_remaining"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("record_remaining")}
      />

      <RefundPaymentModal
        open={activeModalKey === "refund_payment"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("refund_payment")}
      />

      <CancelTripModal
        open={activeModalKey === "cancel_trip"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={() => handleModalSubmit("cancel_trip")}
      />
    </>
  );
}
