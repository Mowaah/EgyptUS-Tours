"use client";

import React, { useState, useEffect } from "react";
import { getB2BDetails } from "../mockB2BData";
import CompanyInformation from "./CompanyInformation";
import ActivityTimeline from "./ActivityTimeline";
import RequestDetailsLayout from "../../shared/RequestDetailsLayout/RequestDetailsLayout";
import { ProposalFile, PaymentOverview } from "../../shared/Sections";

export default function ViewB2BRequest({ requestId }: { requestId: string }) {
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const { getB2BDetails } = await import("@/lib/adminApi");
      const data = await getB2BDetails(requestId);
      setRequestData(data);
    } catch (err) {
      console.error("Failed to fetch B2B details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [requestId]);

  const handleActionSubmit = async (action: string, payload?: any) => {
    try {
      const { b2bActions } = await import("@/lib/adminApi");
      
      switch (action) {
        case "add_note":
          if (payload?.note) await b2bActions.addNote(requestId, payload.note);
          break;
        case "assign":
          if (payload?.agentId) await b2bActions.assign(requestId, payload.agentId, payload.reason);
          break;
        case "create_proposal":
        case "upload_revised_proposal":
          if (payload?.file) await b2bActions.uploadProposal(requestId, payload.file, payload.note);
          break;
        case "mark_proposal_sent":
          await b2bActions.markProposalSent(requestId, payload?.note);
          break;
        case "start_negotiation":
          if (payload?.reason) await b2bActions.startNegotiation(requestId, payload.reason);
          break;
        case "mark_rejected":
          if (payload?.reason) await b2bActions.reject(requestId, payload.reason);
          break;
        case "reopen":
          if (payload?.reason) await b2bActions.reopen(requestId, payload.reason);
          break;
        case "approve":
          if (payload) await b2bActions.approve(requestId, payload);
          break;
        case "record_deposit":
        case "record_remaining":
          if (payload) await b2bActions.recordPayment(requestId, payload);
          break;
        case "cancel_trip":
          if (payload?.reason) await b2bActions.cancel(requestId, payload.reason);
          break;
        case "refund_payment":
          if (payload) await b2bActions.refund(requestId, payload);
          break;
        case "mark_closed":
          await b2bActions.completeTrip(requestId);
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
      breadcrumbLabel="B2B Programs"
      breadcrumbHref="/dashboard/requests/b2b-programs"
      requestTitle={`${requestData.company_name} - ${requestData.request_code}`}
      status={requestData.display_status.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
      date={new Date(requestData.created_at).toLocaleString()}
      leftColumnContent={
        <>
          <CompanyInformation request={requestData.company_information} />
          {requestData.proposal_files && requestData.proposal_files.length > 0 && (
            <ProposalFile files={requestData.proposal_files} />
          )}
          {requestData.payment_overview && (
            <PaymentOverview request={requestData.payment_overview} />
          )}
        </>
      }
      rightColumnContent={
        <>
          <ActivityTimeline timelineRows={requestData.activity_timeline} />
        </>
      }
      onActionSubmit={handleActionSubmit}
    />
  );
}
