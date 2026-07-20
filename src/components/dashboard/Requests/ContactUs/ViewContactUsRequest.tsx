"use client";

import React from "react";
import Image from "next/image";
import { getContactUsDetails } from "./mockContactUsData";
import { getContactUsStatusVariant } from "./contactUsColumns";
import RequestDetailsLayout from "../shared/RequestDetailsLayout/RequestDetailsLayout";
import reqStyles from "../shared/RequestDetailsLayout/RequestDetailsLayout.module.scss";
import InfoCard from "@/components/dashboard/shared/InfoCard/InfoCard";
import ActivityTimeline from "./ActivityTimeline";
import phStyles from "@/components/dashboard/shared/ProfileHeader/ProfileHeader.module.scss";

export default function ViewContactUsRequest({ requestId }: { requestId: string }) {
  const requestData = getContactUsDetails(requestId);

  const customerData = [
    { label: "Full Name", value: requestData.contactInfo.fullName },
    { label: "Email Address", value: requestData.contactInfo.email },
    { label: "Message", value: requestData.contactInfo.message, isColumn: true },
  ];

  let prependActionButtons: any = null;
  let appendActionButtons: any = null;
  let hideDefaultActions = false;

  if (requestData.status === "New") {
    prependActionButtons = (onAction: (key: string) => void) => (
      <button className={phStyles.secondaryActionButton} type="button" onClick={() => onAction("mark_closed")}>
        <Image src="/images/dashboard/requests/contact-us/mark-as-closed.svg" alt="" width={20} height={20} />
        Mark as Closed
      </button>
    );

    appendActionButtons = () => (
      <button className={phStyles.primaryActionButton} type="button">
        <Image src="/images/dashboard/requests/contact-us/reply-via-email.svg" alt="" width={20} height={20} />
        Reply via Email
      </button>
    );
  } else if (requestData.status === "Replied") {
    appendActionButtons = (onAction: (key: string) => void) => (
      <button className={phStyles.primaryActionButton} type="button" onClick={() => onAction("mark_closed")}>
        <Image src="/images/dashboard/requests/contact-us/mark-as-closed.svg" alt="" width={20} height={20} className={phStyles.whiteIcon} />
        Mark as Closed
      </button>
    );
  } else if (requestData.status === "Closed") {
    hideDefaultActions = true;
  }

  return (
    <RequestDetailsLayout
      breadcrumbLabel="Contact Us"
      breadcrumbHref="/dashboard/requests/contact-us"
      breadcrumbCurrent="Contact Us Details"
      requestTitle={`${requestData.applicantName} - ${requestData.requestNumber}`}
      status={requestData.status}
      statusVariant={getContactUsStatusVariant(requestData.status)}
      date={requestData.date}
      prependActionButtons={prependActionButtons}
      appendActionButtons={appendActionButtons}
      hideDefaultActions={hideDefaultActions}
      hideFooter={true}
      leftColumnContent={
        <InfoCard
          title="Customer Information"
          iconSrc="/images/dashboard/sidebar/user-management.svg"
          data={customerData}
        />
      }
      rightColumnContent={<ActivityTimeline />}
    />
  );
}
