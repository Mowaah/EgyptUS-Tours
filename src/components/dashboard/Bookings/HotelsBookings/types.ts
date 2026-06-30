export type HotelBookingStatus = "Upcoming" | "On Trip" | "Canceled" | "Refunded" | "Completed";
export type HotelPaymentStatus = "Paid" | "Pending" | "Overdue";
export type HotelSource = "Website" | "Agent";

export interface HotelBookingData {
  id: string;
  customerName: string;
  checkIn: string;
  checkOut: string;
  roomsCount: number;
  dateTime: string;
  paymentStatus: HotelPaymentStatus;
  status: HotelBookingStatus;
  source: HotelSource;
  assignedAgent: string;
  assignedAgentImage: string;
}
