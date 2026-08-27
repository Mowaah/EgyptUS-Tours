"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getContactUsDetails, getContactUsTimeline, contactUsActions } from "@/services/admin/adminRequestsService";
import { getContactUsStatusVariant } from "./contactUsColumns";
import RequestDetailsLayout from "../shared/RequestDetailsLayout/RequestDetailsLayout";
import { ActivityTimeline } from "../shared/Sections";
import InquiryDetails from "./InquiryDetails";
import phStyles from "@/components/dashboard/shared/ProfileHeader/ProfileHeader.module.scss";

export default function ViewContactUsRequest({ requestId }: { requestId: string }) {
  const [data, setData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [detailsData, timelineData] = await Promise.all([
        getContactUsDetails(requestId),
        getContactUsTimeline(requestId),
      ]);
      setData(detailsData);
      setTimeline(timelineData);
    } catch (err) {
      console.error("Failed to fetch contact us details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [requestId]);

  const handleActionSubmit = async (actionId: string, payload?: any) => {
    switch (actionId) {
      case "assign":
        if (payload?.agentId) {
          await contactUsActions.assign(requestId, payload.agentId, payload.reason);
        }
        break;
      case "add_note":
        if (payload?.note) {
          await contactUsActions.addNote(requestId, payload.note);
        }
        break;
      case "close":
        await contactUsActions.close(requestId, payload?.note || "Closed by admin");
        break;
    }
    await fetchData();
  };

  const handleReplyViaEmail = async () => {
    if (!data?.email) return;

    const subject = encodeURIComponent(`Re: ${data.inquiry_code} - Your Inquiry`);
    const mailtoLink = `mailto:${data.email}?subject=${subject}`;
    window.open(mailtoLink, "_blank");

    try {
      await contactUsActions.reply(requestId, "Replied via email client");
      await fetchData();
    } catch (err) {
      console.error("Failed to mark as replied:", err);
    }
  };

  if (loading || !data) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  const allowedActions = data.allowed_actions || [];
  const displayStatus = (data.display_status || data.status || "").toLowerCase();
  const isReplied = ["replied", "closed"].includes(displayStatus);
  let prependActionButtons: any = null;
  let appendActionButtons: any = null;
  const hideDefaultActions = data.status === "closed";

  if (allowedActions.includes("close")) {
    prependActionButtons = (onAction: (key: string) => void) => (
      <button className={phStyles.secondaryActionButton} type="button" onClick={() => onAction("close")}>
        <Image src="/images/dashboard/requests/contact-us/mark-as-closed.svg" alt="" width={20} height={20} />
        Mark as Closed
      </button>
    );
  }

  if (!isReplied && allowedActions.includes("reply")) {
    appendActionButtons = () => (
      <button className={phStyles.primaryActionButton} type="button" onClick={handleReplyViaEmail}>
        <Image src="/images/dashboard/requests/contact-us/reply-via-email.svg" alt="" width={20} height={20} />
        Reply via Email
      </button>
    );
  }


  return (
    <RequestDetailsLayout
      breadcrumbLabel="Contact Us"
      breadcrumbHref="/dashboard/requests/contact-us"
      breadcrumbCurrent="Contact Us Details"
      requestTitle={`${data.full_name} - ${data.inquiry_code}`}
      status={data.display_status || data.status}
      statusVariant={getContactUsStatusVariant(data.status)}
      date={data.submitted_on ? new Date(data.submitted_on).toLocaleDateString() : ""}
      hideDefaultActions={hideDefaultActions}
      prependActionButtons={prependActionButtons}
      appendActionButtons={appendActionButtons}
      hideFooter={true}
      leftColumnContent={<InquiryDetails data={data} />}
      rightColumnContent={<ActivityTimeline timelineRows={timeline} />}
      onActionSubmit={handleActionSubmit}
    />
  );
}
