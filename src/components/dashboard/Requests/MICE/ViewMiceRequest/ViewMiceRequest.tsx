"use client";

import React, { useState, useEffect } from "react";
import { ProposalFile, PaymentOverview, ActivityTimeline } from "../../shared/Sections";
import RefundSummary from "@/components/dashboard/shared/RefundSummary/RefundSummary";
import OrganizationInformation from "./OrganizationInformation";
import EventDetails from "./EventDetails";
import EventRequirements from "./EventRequirements";
import BudgetInformation from "./BudgetInformation";
import RequestDetailsLayout from "../../shared/RequestDetailsLayout/RequestDetailsLayout";
import { getEventsDetails, getMiceTimeline, eventsActions } from "@/services/admin/adminRequestsService";
import { formatStatusLabel } from "../miceColumns";

export default function ViewMiceRequest({ requestId }: { requestId: string }) {
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const data = await getEventsDetails(requestId);
      setRequestData(data);
    } catch (err) {
      console.error("Failed to fetch Events details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [requestId]);

  const handleActionSubmit = async (action: string, payload?: any) => {
    try {
      const { eventsActions } = await import("@/services/admin/adminRequestsService");
      
      switch (action) {
        case "add_note":
          if (payload?.note) await eventsActions.addNote(requestId, payload.note);
          break;
        case "assign":
          if (payload?.agentId) await eventsActions.assign(requestId, payload.agentId, payload.reason);
          break;
        case "create_proposal":
        case "upload_revised_proposal":
          if (payload?.file) await eventsActions.uploadProposal(requestId, payload.file, payload.note);
          break;
        case "mark_proposal_sent":
          await eventsActions.markProposalSent(requestId, payload?.note);
          break;
        case "start_negotiation":
          if (payload?.reason) await eventsActions.startNegotiation(requestId, payload.reason);
          break;
        case "mark_rejected":
          if (payload?.reason) await eventsActions.reject(requestId, payload.reason);
          break;
        case "reopen":
          if (payload?.reason) await eventsActions.reopen(requestId, payload.reason);
          break;
        case "approve":
          if (payload) await eventsActions.approve(requestId, payload);
          break;
        case "record_deposit":
        case "record_remaining":
          if (payload) await eventsActions.recordPayment(requestId, payload);
          break;
        case "cancel_trip":
          if (payload?.reason) await eventsActions.cancel(requestId, payload.reason);
          break;
        case "refund_payment":
          if (payload) await eventsActions.refund(requestId, payload);
          break;
        case "mark_closed":
          await eventsActions.completeTrip(requestId);
          break;
      }
      
      await fetchDetails();
    } catch (err) {
      console.error("Action failed:", err);
      throw err; 
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading request details...</div>;
  }

  if (!requestData) {
    return <div style={{ padding: "40px", textAlign: "center", color: "red" }}>Request not found.</div>;
  }

  return (
    <RequestDetailsLayout
      breadcrumbLabel="MICE Corporate"
      breadcrumbHref="/dashboard/requests/mice-corporate"
      requestTitle={`${requestData.organization_name || requestData.organization_information?.organization_name || "MICE"} - ${requestData.request_code}`}
      status={formatStatusLabel(requestData.display_status)}
      date={new Date(requestData.created_at).toLocaleString()}
      lastUpdated={requestData.updated_at}
      leftColumnContent={
        <>
          <OrganizationInformation request={requestData.organization_information} />
          <EventRequirements request={requestData.event_requirements} />
          <BudgetInformation request={requestData.budget_information} />
          {requestData.proposal_files && requestData.proposal_files.length > 0 && (
            <ProposalFile files={requestData.proposal_files} />
          )}
          {requestData.payment_overview && !["new", "in_progress"].includes(requestData.display_status) && (
            <PaymentOverview request={requestData.payment_overview} />
          )}
          {requestData.refund_summary && (
            <RefundSummary data={requestData.refund_summary} />
          )}
        </>
      }
      rightColumnContent={
        <>
          <EventDetails request={requestData.event_details} />
          <ActivityTimeline timelineRows={requestData.activity_timeline} />
        </>
      }
      onActionSubmit={handleActionSubmit}
    />
  );
}
