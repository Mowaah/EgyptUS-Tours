import React from "react";
import { ActivityTimeline, Milestone } from "@/components/dashboard/shared";;

const defaultMilestones: Milestone[] = [
  {
    id: "m1",
    title: "Lead Created",
    time: "Oct 26, 09:14 AM",
    description: "Lead imported and assigned to Ahmed Hassan",
    status: "completed",
  },
  {
    id: "m2",
    title: "Note Added",
    time: "Oct 26, 09:14 AM",
    description: "Customer confirmed interest in a 7-day Egypt travel package including Cairo, Luxor, and Aswan. Travel dates have been finalized for the second week of December, and the estimated budget aligns with the proposed package options. The customer requested a detailed quotation including accommodation, transportation, and guided tours. Lead has been qualified and is ready for the next stage of proposal preparation and booking coordination.",
    status: "completed",
  },
  {
    id: "m3",
    title: "Lead Contacted",
    time: "Oct 26, 09:14 AM",
    description: "Interested in Cairo & Luxor package.",
    status: "completed",
  },
  {
    id: "m4",
    title: "Lead Qualified",
    time: "Oct 26, 09:14 AM",
    description: "Customer confirmed travel dates and budget.",
    status: "completed",
  },
  {
    id: "m5",
    title: "Lead Converted to Request",
    time: "--",
    description: "Custom trip request created and assigned to Operations.",
    status: "pending",
  },
  {
    id: "m6",
    title: "Lead Closed",
    time: "--",
    description: "Reason: Not Qualified",
    status: "pending",
  },
];

interface ActivityTimelineProps {
  milestones?: Milestone[];
}

export default function LeadActivityTimeline({ milestones = defaultMilestones }: ActivityTimelineProps) {
  return <ActivityTimeline milestones={milestones} />;
}
