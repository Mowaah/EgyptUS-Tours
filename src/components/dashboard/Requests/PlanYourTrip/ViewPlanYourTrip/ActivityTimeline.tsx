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
    title: "Assigned to Sara Mohamed",
    description: "Inquiry assigned to sara mohamed for initial review and follow-up.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "3",
    title: "Note Added",
    description: "Client requested luxury hotel options",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "4",
    title: "Proposal Created",
    description: "A customized proposal has been prepared.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "5",
    title: "Proposal Marked as Sent",
    description: "Proposal sent via WhatsApp to the customer",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "6",
    title: "Negotiation Started",
    description: "Customer requested changes to the proposal",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "7",
    title: "Revised Proposal Uploaded",
    description: "A revised proposal has been uploaded",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "8",
    title: "Revised Proposal Sent",
    description: "The updated proposal has been shared with the customer.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "9",
    title: "Request Approved & Payment Plan Created",
    description: "Customer approved the proposal & 30% deposit payment plan configured.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "10",
    title: "Awaiting Payment",
    description: "Waiting for the customer to complete the required payment.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "11",
    title: "30% Deposit Payment Received",
    description: "Customer paid the 30% deposit.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "12",
    title: "Remaining Payment Received",
    description: "Remaining Balance of $1,750 received via Paymob.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "13",
    title: "Trip Reminder Sent",
    description: "Reminder sent to the customer before departure.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "14",
    title: "Trip Started",
    description: "Customer has started the trip.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "15",
    title: "Trip Completed",
    description: "Customer successfully completed the trip.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "16",
    title: "Review Request Sent",
    description: "A review request was sent to the customer after completing the trip.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "17",
    title: "Customer Review Received",
    description: "Customer submitted a 5-star review.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "18",
    title: "Trip Cancelled",
    description: "Reason: Customer requested to cancel due to a change of plans.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  },
  {
    id: "19",
    title: "Refund Completed",
    description: "Refund of $1750 has been successfully processed.",
    time: "Oct 26, 09:14 AM",
    status: "completed",
  }
];

export default function PlanYourTripActivityTimeline() {
  return <ActivityTimeline milestones={mockActivities} />;
}
