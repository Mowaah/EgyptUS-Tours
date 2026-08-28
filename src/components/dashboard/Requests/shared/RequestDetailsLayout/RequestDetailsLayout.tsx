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
  CancelTripModal,
  MarkAsClosedModal
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
  lastUpdated?: string;
  leftColumnContent: React.ReactNode;
  rightColumnContent: React.ReactNode;
  prependActionButtons?: React.ReactNode | ((onAction: (key: string) => void) => React.ReactNode);
  appendActionButtons?: React.ReactNode | ((onAction: (key: string) => void) => React.ReactNode);
  breadcrumbCurrent?: string;
  hideDefaultActions?: boolean;
  statusVariant?: string;
  hideFooter?: boolean;
  onActionSubmit?: (action: string, payload?: any) => Promise<void>;
  hasUnsentProposal?: boolean;
  paymentOverview?: {
    total_price: string;
    deposit_amount: string;
    remaining_balance: string;
    currency: string;
  };
  refundSummary?: {
    package_total: string;
    days_before_travel: number;
    policy_applied: string;
    deduction_percentage: number;
    deduction_amount: string;
    refund_amount: string;
    currency: string;
  };
}

export default function RequestDetailsLayout({
  breadcrumbLabel,
  breadcrumbHref,
  requestTitle,
  status,
  date,
  lastUpdated,
  leftColumnContent,
  rightColumnContent,
  prependActionButtons,
  appendActionButtons,
  breadcrumbCurrent,
  hideDefaultActions,
  statusVariant,
  hideFooter,
  onActionSubmit,
  hasUnsentProposal,
  paymentOverview,
  refundSummary
}: RequestDetailsLayoutProps) {
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState("");
  const [agents, setAgents] = useState<any[]>([]);

  React.useEffect(() => {
    if (activeModalKey === "assign") {
      const fetchAgents = async () => {
        try {
          const { getAdminUsers } = await import("@/services/admin/adminUsersService");
          const res = await getAdminUsers({ is_active: true });
          const users = res.results || res;
          const formattedAgents = users.map((u: any) => ({
            id: u.id.toString(),
            name: u.full_name,
            avatarSrc: u.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name || 'A')}&background=F4EDE6&color=4A3D36` // Dynamic generic avatar
          }));
          setAgents(formattedAgents);
        } catch (err) {
          console.error("Failed to fetch agents", err);
        }
      };
      fetchAgents();
    }
  }, [activeModalKey]);

  const handleModalSubmit = async (action: string, payload?: any) => {
    try {
      if (onActionSubmit) {
        await onActionSubmit(action, payload);
      }
      let successMessage = "";
      if (action === "add_note") {
        successMessage = "The Note has been added successfully";
      } else if (action === "assign") {
        successMessage = "The Request has been assigned to employee successfully";
      } else if (action === "mark_closed") {
        successMessage = "The Request has been marked as closed successfully";
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
    } catch (err) {
      console.error("Action failed:", err);
      // Optional: set an error banner
    }
  };

  return (
    <>
      <DashboardNavbar
        breadcrumbTrail={[
          { label: "Requests" },
          { label: breadcrumbLabel, href: breadcrumbHref },
          { label: breadcrumbCurrent || requestTitle.split(" - ")[1] || "Details" }
        ]}
      >
        <ProfileHeader
          title={requestTitle}
          customPills={
            <StatusPill 
              label={status} 
              variant={(statusVariant as any) || getStatusVariant(status)} 
            />
          }
          subtitleElements={[date]}
          actionButtons={
            <>
              {typeof prependActionButtons === 'function' ? prependActionButtons(setActiveModalKey) : prependActionButtons}
              {!hideDefaultActions && (
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
              )}
              {typeof appendActionButtons === 'function' ? appendActionButtons(setActiveModalKey) : appendActionButtons}
            </>
          }
        />
      </DashboardNavbar>

      <div className={styles.contentWrapper}>
        <DashboardStatusBanner 
          message={bannerMessage} 
          show={!!bannerMessage} 
          onClose={() => setBannerMessage("")} 
        />
        
        <div className={styles.gridContainer}>
          <div className={styles.leftColumn}>
            {leftColumnContent}
          </div>
          
          <div className={styles.rightColumn}>
            {rightColumnContent}
          </div>
        </div>

        {!hideFooter && status !== "New" && (
          <div className={styles.footer}>
            <div className={styles.footerDate}>
              Last Update: <br/> <strong>{lastUpdated ? (() => { const d = new Date(lastUpdated); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; })() : "—"}</strong>
            </div>
            <div className={styles.footerActions}>
              {status === "Negotiation" ? (
                <>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("assign")}
                  >
                    <Image src="/images/dashboard/requests/footer/re-assign.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("mark_rejected")}
                  >
                    <Image src="/images/dashboard/requests/footer/mark-as-rejected.svg" alt="" width={20} height={20} />
                    Mark as Rejected
                  </button>
                  {hasUnsentProposal ? (
                    <button
                      className={styles.createProposalBtn}
                      type="button"
                      onClick={() => setActiveModalKey("mark_proposal_sent")}
                    >
                      <Image src="/images/dashboard/requests/footer/mark-proposal-as-sent.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                      Mark proposal as sent
                    </button>
                  ) : (
                    <button
                      className={styles.createProposalBtn}
                      type="button"
                      onClick={() => setActiveModalKey("upload_revised_proposal")}
                    >
                      <Image src="/images/dashboard/requests/footer/create-proposal.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                      Upload Revised Proposal
                    </button>
                  )}
                </>
              ) : status === "30% Pending Payment" ? (
                <>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("assign")}
                  >
                    <Image src="/images/dashboard/requests/footer/re-assign.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("mark_rejected")}
                  >
                    <Image src="/images/dashboard/requests/footer/mark-as-rejected.svg" alt="" width={20} height={20} />
                    Mark as Rejected
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setBannerMessage("Email reminder sent")}
                  >
                    <Image src="/images/dashboard/requests/footer/send-email-remainder.svg" alt="" width={20} height={20} />
                    Send Email Reminder
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("record_deposit")}
                  >
                    <Image src="/images/dashboard/requests/footer/record-deposit-payment.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
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
                    <Image src="/images/dashboard/requests/footer/re-assign.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("cancel_trip")}
                  >
                    <Image src="/images/dashboard/requests/footer/cancel-trip.svg" alt="" width={20} height={20} />
                    Cancel Trip
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setBannerMessage("Remaining payment reminder sent")}
                  >
                    <Image src="/images/dashboard/requests/footer/send-email-remainder.svg" alt="" width={20} height={20} />
                    Send Remaining Payment Reminder
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("record_remaining")}
                  >
                    <Image src="/images/dashboard/requests/footer/record-deposit-payment.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
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
                    <Image src="/images/dashboard/requests/footer/re-assign.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("cancel_trip")}
                  >
                    <Image src="/images/dashboard/requests/footer/cancel-trip.svg" alt="" width={20} height={20} />
                    Cancel Trip
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setBannerMessage("The Trip Reminder send via email Successfully")}
                  >
                    <Image src="/images/dashboard/requests/footer/send-email-remainder.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
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
                  <Image src="/images/dashboard/requests/footer/view-customer-review.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                  View Customer Review
                </button>
              ) : status === "Cancelled" ? (
                <>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("assign")}
                  >
                    <Image src="/images/dashboard/requests/footer/re-assign.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("refund_payment")}
                  >
                    <Image src="/images/dashboard/requests/footer/refund-payment.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                    Refund Payment
                  </button>
                </>
              ) : status === "Rejected" ? (
                <button
                  className={styles.createProposalBtn}
                  type="button"
                  onClick={() => setActiveModalKey("reopen")}
                >
                  <Image src="/images/dashboard/requests/footer/reopen-request.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
                  Reopen Request
                </button>
              ) : status === "Proposal Sent" ? (
                <>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("assign")}
                  >
                    <Image src="/images/dashboard/requests/footer/re-assign.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("mark_rejected")}
                  >
                    <Image src="/images/dashboard/requests/footer/mark-as-rejected.svg" alt="" width={20} height={20} />
                    Mark as Rejected
                  </button>
                  <button
                    className={styles.reassignBtn}
                    type="button"
                    onClick={() => setActiveModalKey("start_negotiation")}
                  >
                    <Image src="/images/dashboard/requests/footer/start-negotiation.svg" alt="" width={20} height={20} />
                    Start Negotiation
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("approve")}
                  >
                    <Image src="/images/dashboard/requests/footer/mark-as-approved.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
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
                    <Image src="/images/dashboard/requests/footer/re-assign.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("mark_proposal_sent")}
                  >
                    <Image src="/images/dashboard/requests/footer/mark-proposal-as-sent.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
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
                    <Image src="/images/dashboard/requests/footer/re-assign.svg" alt="" width={20} height={20} />
                    Re-Assign to Employee
                  </button>
                  <button
                    className={styles.createProposalBtn}
                    type="button"
                    onClick={() => setActiveModalKey("create_proposal")}
                  >
                    <Image src="/images/dashboard/requests/footer/create-proposal.svg" alt="" width={20} height={20} className={styles.whiteIcon} />
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
        onSubmit={(note) => handleModalSubmit("add_note", { note })} 
      />
      
      <ReassignModal
        open={activeModalKey === "assign"}
        onClose={() => setActiveModalKey(null)}
        onConfirm={(agentId, reason) => handleModalSubmit("assign", { agentId, reason })}
        agents={agents.length > 0 ? agents : undefined}
        showReasonField={status !== "New"}
        title={status === "New" ? "Assign to Employee" : "Re-Assign to Employee"}
        subtitle=""
      />

      <CreateProposalModal
        open={activeModalKey === "create_proposal"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(file, note) => handleModalSubmit("create_proposal", { file, note })}
      />

      <MarkProposalSentModal
        open={activeModalKey === "mark_proposal_sent"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(note) => handleModalSubmit("mark_proposal_sent", { note })}
      />

      <RejectRequestModal
        open={activeModalKey === "mark_rejected"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(reason) => handleModalSubmit("mark_rejected", { reason })}
      />

      <ReopenRequestModal
        open={activeModalKey === "reopen"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(reason) => handleModalSubmit("reopen", { reason })}
      />

      <StartNegotiationModal
        open={activeModalKey === "start_negotiation"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(reason) => handleModalSubmit("start_negotiation", { reason })}
      />

      <UploadRevisedProposalModal
        open={activeModalKey === "upload_revised_proposal"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(file, note) => handleModalSubmit("upload_revised_proposal", { file, note })}
      />

      <ApproveRequestModal
        open={activeModalKey === "approve"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(data) => handleModalSubmit("approve", data)}
      />

      <RecordDepositPaymentModal
        open={activeModalKey === "record_deposit"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(data) => handleModalSubmit("record_deposit", data)}
        paymentOverview={paymentOverview}
      />

      <RecordRemainingPaymentModal
        open={activeModalKey === "record_remaining"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(data) => handleModalSubmit("record_remaining", data)}
        paymentOverview={paymentOverview}
      />

      <RefundPaymentModal
        open={activeModalKey === "refund_payment"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(data) => handleModalSubmit("refund_payment", data)}
        refundSummary={refundSummary}
      />

      <CancelTripModal
        open={activeModalKey === "cancel_trip"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(reason) => handleModalSubmit("cancel_trip", { reason })}
      />
      <MarkAsClosedModal
        isOpen={activeModalKey === "close"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(note) => handleModalSubmit("close", { note })}
      />
      <ActionNoteModal
        open={activeModalKey === "reply"}
        onClose={() => setActiveModalKey(null)}
        onSubmit={(message) => handleModalSubmit("reply", { message })}
        config={{
          title: "Reply via Email",
          iconSrc: "/images/dashboard/requests/contact-us/reply-via-email.svg",
          label: "Message",
          primaryLabel: "Send Reply",
          placeholder: "Type your reply to the customer...",
        }}
      />
    </>
  );
}
