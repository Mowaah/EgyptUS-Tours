"use client";

import React, { useState, useEffect } from "react";
import { CustomerInformation, ProposalFile, PaymentOverview, ActivityTimeline } from "../../shared/Sections";
import { getPlanYourTripDetails } from "@/services/admin/adminRequestsService";
import TripPreferences from "./TripPreferences";
import TripDetails from "./TripDetails";
import RequestDetailsLayout from "../../shared/RequestDetailsLayout/RequestDetailsLayout";
import RefundSummary from "@/components/dashboard/shared/RefundSummary/RefundSummary";
import { formatStatusLabel } from "../planYourTripColumns";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ViewPlanYourTrip({ requestId }: { requestId: string }) {
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const data = await getPlanYourTripDetails(requestId);
      setRequestData(data);
    } catch (err) {
      console.error("Failed to fetch plan your trip details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [requestId]);

  const handleActionSubmit = async (action: string, payload?: any) => {
    try {
      const { planYourTripActions } = await import("@/services/admin/adminRequestsService");
      
      switch (action) {
        case "add_note":
          if (!payload?.note) throw new Error("Note is required");
          await planYourTripActions.addNote(requestId, payload.note);
          break;
        case "assign":
          if (!payload?.agentId) throw new Error("Agent ID is required");
          await planYourTripActions.assign(requestId, payload.agentId, payload.reason);
          break;
        case "create_proposal":
        case "upload_revised_proposal":
          if (!payload?.file) throw new Error("File is required");
          await planYourTripActions.uploadProposal(requestId, payload.file, payload.note);
          break;
        case "mark_proposal_sent":
          await planYourTripActions.markProposalSent(requestId, payload?.note);
          break;
        case "start_negotiation":
          if (!payload?.reason) throw new Error("Negotiation reason is required");
          await planYourTripActions.startNegotiation(requestId, payload.reason);
          break;
        case "mark_rejected":
          if (!payload?.reason) throw new Error("Rejection reason is required");
          await planYourTripActions.reject(requestId, payload.reason);
          break;
        case "reopen":
          if (!payload?.reason) throw new Error("Reopen reason is required");
          await planYourTripActions.reopen(requestId, payload.reason);
          break;
        case "approve":
          if (!payload) throw new Error("Payload is required");
          await planYourTripActions.approve(requestId, payload);
          break;
        case "record_deposit":
        case "record_remaining":
          if (!payload) throw new Error("Payload is required");
          await planYourTripActions.recordPayment(requestId, payload);
          break;
        case "cancel_trip":
          if (!payload?.reason) throw new Error("Cancellation reason is required");
          await planYourTripActions.cancel(requestId, payload.reason);
          break;
        case "refund_payment":
          if (payload) await planYourTripActions.refund(requestId, payload);
          break;
        case "mark_closed":
          await planYourTripActions.completeTrip(requestId);
          break;
        case "send_payment_reminder": await planYourTripActions.sendPaymentReminder(requestId, payload.reminder_type); break; case "send_trip_reminder": await planYourTripActions.sendTripReminder(requestId); break;
      }
      
      await fetchDetails();
    } catch (err) {
      console.error("Action failed:", err);
      throw err; // re-throw so RequestDetailsLayout can catch if it wants
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
      breadcrumbLabel="Plan Your trip"
      breadcrumbHref="/dashboard/requests/plan-your-trip"
      requestTitle={`${requestData.full_name} - ${requestData.request_code}`}
      status={formatStatusLabel(requestData.display_status)}
      date={new Date(requestData.created_at).toLocaleString()}
      lastUpdated={requestData.updated_at}
      hasUnsentProposal={requestData.proposal_files?.some((p: any) => p.sent_at === null)}
      paymentOverview={requestData.payment_overview}
      refundSummary={requestData.refund_summary}
      leftColumnContent={
        <>
          <CustomerInformation 
            request={{
              name: requestData.customer_information.full_name || "",
              email: requestData.customer_information.email || "",
              phone: requestData.customer_information.phone || "",
              nationality: requestData.customer_information.nationality || "",
            }} 
          />
          <TripDetails 
            request={{
              category: requestData.trip_details.trip_categories?.join(", ") 
                || requestData.trip_preferences.trip_category?.join(", ")
                || "-",
              duration: requestData.trip_details.number_of_days ? `${requestData.trip_details.number_of_days} Days` : "-",
              budget: requestData.trip_details.budget_min 
                ? (requestData.trip_details.budget_max ? `$${requestData.trip_details.budget_min} - $${requestData.trip_details.budget_max}` : `$${requestData.trip_details.budget_min}+`) 
                : (requestData.trip_preferences.budget || "-"),
              hotelCategory: parseInt(requestData.trip_preferences.hotel_category) || 0,
              roomType: requestData.trip_preferences.room_types?.length > 0
                ? requestData.trip_preferences.room_types.join(", ")
                : requestData.trip_preferences.room_type 
                  ? requestData.trip_preferences.room_type.replace(/[\[\]']/g, '') 
                  : "-",
              transportation: requestData.trip_preferences.transportation_type || "-",
              additionalExperience: requestData.trip_preferences.experiences?.join(", ") || "-",
              activities: requestData.trip_preferences.activities?.join(", ") || "-",
              contactMethod: requestData.customer_information.preferred_contact_method 
                || requestData.trip_preferences.contact_method 
                || "-",
              specialRequest: requestData.trip_details.special_request || "None",
            }} 
          />
          {requestData.proposal_files && requestData.proposal_files.length > 0 && (
            <ProposalFile files={requestData.proposal_files} />
          )}
          {requestData.payment_overview && ["approved", "cancelled"].includes(requestData.workflow_status) && (
            <PaymentOverview request={requestData.payment_overview} />
          )}
          {requestData.refund_summary && (
            <RefundSummary data={requestData.refund_summary} />
          )}
        </>
      }
      rightColumnContent={
        <>
          <TripPreferences 
            request={{
              destinations: requestData.trip_details.destinations?.map((d: any) => d.name).join(", ") || "-",
              startDate: requestData.trip_details.start_date || "-",
              endDate: requestData.trip_details.end_date || "-",
              travelers: `${requestData.trip_details.adults} Adults, ${requestData.trip_details.children} Children, ${requestData.trip_details.infants} Infants`,
            }} 
          />
          <ActivityTimeline timelineRows={requestData.activity_timeline} />
        </>
      }
      onActionSubmit={handleActionSubmit}
    />
  );
}
