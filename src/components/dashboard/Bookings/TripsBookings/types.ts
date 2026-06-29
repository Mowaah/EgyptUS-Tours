export interface TripSummaryMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  tone: "blue" | "orange" | "pink" | "purple" | "green";
  icon: string;
}

export interface TripBookingRow {
  id: string;
  customerName: string;
  tripName: string;
  dates: string;
  tourType: "Private" | "Group";
  depositStatus: "Paid" | "Pending" | "Overdue";
  status: "Upcoming" | "Canceled" | "Refunded" | "On Trip" | "Completed";
  source: "Website" | "Agent";
  assignedAgent: string;
}