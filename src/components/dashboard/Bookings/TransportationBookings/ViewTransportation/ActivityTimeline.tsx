import { ActivityTimeline, Milestone } from "@/components/dashboard/shared";;

export default function TripsActivityTimeline() {
  const activities: Milestone[] = [
    {
      id: "1",
      title: "Booking Submitted & Deposit Paid (30%)",
      description: "Guest completed the booking and paid the required deposit.",
      time: "Oct 26, 09:14 AM",
      status: "completed",
    },
    {
      id: "2",
      title: "Payment Reminder Sent",
      description: "A reminder was sent to the guest for the remaining balance payment.",
      time: "Oct 26, 09:14 AM",
      status: "completed",
    },
    {
      id: "3",
      title: "Final Payment Pending (70%)",
      description: "-",
      time: "Oct 26, 09:14 AM",
      status: "pending",
    },
    {
      id: "4",
      title: "Trip Reminder Sent",
      description: "A reminder was sent to the guest for the remaining balance payment.",
      time: "Oct 26, 09:14 AM",
      status: "pending",
    },
    {
      id: "5",
      title: "On Trip",
      description: "-",
      time: "Oct 26, 09:14 AM",
      status: "pending",
    },
    {
      id: "6",
      title: "Trip Completed",
      description: "-",
      time: "Oct 26, 09:14 AM",
      status: "pending",
    },
  ];

  return <ActivityTimeline milestones={activities} />;
}
