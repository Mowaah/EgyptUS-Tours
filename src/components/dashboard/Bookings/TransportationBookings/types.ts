export interface TransportationBookingRow {
  id: number;
  booking_code: string;
  customer_name: string;
  customer_email: string;
  vehicle_id: number;
  vehicle_name: string;
  vehicle_class: string;
  route: string;
  pickup_date: string;
  pickup_time: string;
  trip_type: "one_way" | "round_trip";
  operational_status: "upcoming" | "completed" | "cancelled" | "refunded";
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
