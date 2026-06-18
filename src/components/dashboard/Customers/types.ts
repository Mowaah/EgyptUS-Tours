export type CustomerStatus = "Active" | "Inactive" | "Blocked";

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  bookings: number;
  totalSpent: string;
  lastActivity: string;
  status: CustomerStatus;
}

export interface CustomerSummaryMetric {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  tone?: "blue" | "orange" | "pink" | "purple" | "green" | "gray";
  iconSrc: string;
}
