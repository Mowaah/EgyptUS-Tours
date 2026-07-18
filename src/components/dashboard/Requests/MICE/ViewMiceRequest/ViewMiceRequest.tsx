"use client";

import React from "react";
import { ProposalFile, PaymentOverview } from "../../shared/Sections";
import { getMiceDetails } from "../mockMiceData";
import RefundSummary from "@/components/dashboard/shared/RefundSummary/RefundSummary";
import OrganizationInformation from "./OrganizationInformation";
import EventDetails from "./EventDetails";
import EventRequirements from "./EventRequirements";
import BudgetInformation from "./BudgetInformation";
import ActivityTimeline from "./ActivityTimeline";
import RequestDetailsLayout from "../../shared/RequestDetailsLayout/RequestDetailsLayout";

export default function ViewMiceRequest({ requestId }: { requestId: string }) {
  const requestData = getMiceDetails(requestId);

  return (
    <RequestDetailsLayout
      breadcrumbLabel="MICE Corporate"
      breadcrumbHref="/dashboard/requests/mice-corporate"
      requestTitle={`${requestData.applicantName} - ${requestData.requestNumber}`}
      status={requestData.status}
      date={requestData.date}
      leftColumnContent={
        <>
          <OrganizationInformation request={requestData.organization} />
          <EventRequirements request={requestData.eventRequirements} />
          <BudgetInformation request={requestData.budget} />
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
          <EventDetails request={requestData.eventDetails} />
          <ActivityTimeline />
        </>
      }
    />
  );
}
