import React from "react";
import { ActivityTimeline as SharedTimeline, Milestone } from "@/components/dashboard/shared";

const mockActivities: Milestone[] = [
  {
    id: "1",
    title: "Contact Request Submitted",
    description: "Customer submitted a new contact request.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "2",
    title: "Assigned to Ahmed Hassan",
    description: "Request assigned to Ahmed Hassan for review.",
    time: "Oct 26, 09:14 AM",
    status: "pending",
  },
  {
    id: "3",
    title: "Note Added",
    description: "Customer prefers luxury hotels",
    time: "Oct 26, 09:14 AM",
    status: "pending",
  },
  {
    id: "4",
    title: "Reply Sent",
    description: "A response was sent to the customer via email.",
    time: "Oct 26, 09:14 AM",
    status: "pending",
  },
  {
    id: "5",
    title: "Conversation Closed",
    description: "Conversation marked as closed.",
    time: "Oct 26, 09:14 AM",
    status: "pending",
  }
];

export default function ActivityTimeline() {
  return <SharedTimeline milestones={mockActivities} />;
}
