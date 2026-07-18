"use client";

import React from "react";
import { CustomerInformation, ProposalFile, PaymentOverview } from "../../shared/Sections";
import { getPlanYourTripDetails } from "../mockPlanYourTripData";
import TripPreferences from "./TripPreferences";
import TripDetails from "./TripDetails";
import ActivityTimeline from "./ActivityTimeline";
import RequestDetailsLayout from "../../shared/RequestDetailsLayout/RequestDetailsLayout";
import RefundSummary from "@/components/dashboard/shared/RefundSummary/RefundSummary";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ViewPlanYourTrip({ requestId }: { requestId: string }) {
  const requestData = getPlanYourTripDetails(requestId);
  
  return (
    <RequestDetailsLayout
      breadcrumbLabel="Plan Your trip"
      breadcrumbHref="/dashboard/requests/plan-your-trip"
      requestTitle={`${requestData.name} - ${requestData.id}`}
      status={requestData.status}
      date={requestData.date}
      leftColumnContent={
        <>
          <CustomerInformation request={requestData.customer} />
          <TripDetails request={requestData.details} />
          {(["Proposal Ready", "Proposal Sent", "30% Pending Payment", "Deposit Paid", "Fully Paid", "In Trip", "Completed", "Cancelled", "Refund Completed"].includes(requestData.status)) && (
            <ProposalFile />
          )}
          {(["30% Pending Payment", "Deposit Paid", "Fully Paid", "In Trip", "Completed", "Cancelled", "Refund Completed"].includes(requestData.status)) && requestData.paymentOverview && (
            <PaymentOverview request={requestData.paymentOverview} />
          )}
          {requestData.status === "Refund Completed" && (
            <RefundSummary 
              data={{
                reference: "FT24032658791",
                notes: "We are looking for a complete tourism management solution to manage bookings, customer inquiries, transportation services, and partner coordination more efficiently."
              }}
            />
          )}
        </>
      }
      rightColumnContent={
        <>
          <TripPreferences request={requestData.preferences} />
          <ActivityTimeline />
        </>
      }
    />
  );
}
