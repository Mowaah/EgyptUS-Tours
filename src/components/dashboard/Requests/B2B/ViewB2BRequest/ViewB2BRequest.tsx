"use client";

import React from "react";
import { getB2BDetails } from "../mockB2BData";
import CompanyInformation from "./CompanyInformation";
import ActivityTimeline from "./ActivityTimeline";
import RequestDetailsLayout from "../../shared/RequestDetailsLayout/RequestDetailsLayout";
import { ProposalFile, PaymentOverview } from "../../shared/Sections";

export default function ViewB2BRequest({ requestId }: { requestId: string }) {
  const requestData = getB2BDetails(requestId);

  return (
    <RequestDetailsLayout
      breadcrumbLabel="B2B Programs"
      breadcrumbHref="/dashboard/requests/b2b-programs"
      requestTitle={`${requestData.applicantName} - ${requestData.requestNumber}`}
      status={requestData.status}
      date={requestData.date}
      leftColumnContent={
        <>
          <CompanyInformation request={requestData.companyInfo} />
          {/* Include ProposalFile and PaymentOverview for later stages just like MICE/Plan Your Trip */}
          {(["Proposal Ready", "Proposal Sent", "30% Pending Payment", "Deposit Paid", "Fully Paid", "In Trip", "Completed", "Cancelled", "Refund Completed"].includes(requestData.status)) && (
            <ProposalFile />
          )}
          {(["30% Pending Payment", "Deposit Paid", "Fully Paid", "In Trip", "Completed", "Cancelled", "Refund Completed"].includes(requestData.status)) && (
            <PaymentOverview request={{
              paymentPlan: "30% Deposit",
              paymentMethod: "Paymob",
              totalPackage: 25000,
              depositAmount: 7500,
              remainingAmount: 17500
            }} />
          )}
        </>
      }
      rightColumnContent={
        <>
          <ActivityTimeline />
        </>
      }
    />
  );
}
