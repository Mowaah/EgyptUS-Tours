import React from "react";
import { ActivityTimeline, Milestone } from "@/components/dashboard/shared";

const mockActivities: Milestone[] = [
  {
    id: "1",
    title: "Lead Submitted",
    description: "Customer submitted a new inquiry for a corporate event in Dubai.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "2",
    title: "Assigned to Ahmed Hassan",
    description: "Request assigned to Ahmed Hassan for review.",
    status: "pending",
  },
  {
    id: "3",
    title: "Note Added",
    description: "Customer prefers luxury hotels",
    status: "pending",
  },
  {
    id: "4",
    title: "Proposal Created",
    description: "A customized proposal has been prepared.",
    status: "pending",
  },
  {
    id: "5",
    title: "Proposal Sent",
    description: "Proposal sent to the customer via email.",
    status: "pending",
  },
  {
    id: "6",
    title: "Proposal Approved",
    description: "Customer approved the submitted proposal.",
    status: "pending",
  },
];

export default function PlanYourTripActivityTimeline() {
  return <ActivityTimeline milestones={mockActivities} />;
}
