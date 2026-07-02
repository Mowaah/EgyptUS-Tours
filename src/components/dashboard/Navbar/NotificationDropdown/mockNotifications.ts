export type Notification = {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
};

export const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Booking Received",
    description: "A new trip booking has been successfully submitted. Review the details and confirm the reservation.",
    isRead: false,
  },
  {
    id: "2",
    title: "Overdue Payment Alert",
    description: "Some bookings have pending payments past their due date. Take action to follow up with customers.",
    isRead: false,
  },
  {
    id: "3",
    title: "Payment Received",
    description: "Some bookings have pending payments past their due date. Take action to follow up with customers.",
    isRead: true,
  },
  {
    id: "4",
    title: "New Partner Request",
    description: "A new B2B partnership request has been submitted. Review the company details and respond accordingly.",
    isRead: true,
  },
];
