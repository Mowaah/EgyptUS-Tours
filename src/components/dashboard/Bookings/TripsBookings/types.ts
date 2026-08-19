export interface TripSummaryMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  tone: "blue" | "orange" | "pink" | "purple" | "green";
  icon: string;
}

export interface TripBookingRow {
  id: number;
  booking_code: string;
  customer_name: string;
  email: string;
  trip_title: string;
  start_date: string;
  end_date: string;
  adults: number;
  tour_type: "private" | "group";
  operational_status: "upcoming" | "on_trip" | "completed" | "cancelled" | "refunded";
  payment_display: string;
  source: "website" | "admin";
  assigned_to: { id: number; full_name: string; profile_picture: string | null } | null;
  status: "pending" | "approved" | "rejected";
  payment_status: "pending" | "partially_paid" | "paid";
  remaining_payment_status: "paid" | "pending" | "overdue";
  total_price: string;
  currency: string;
  created_at: string;
}