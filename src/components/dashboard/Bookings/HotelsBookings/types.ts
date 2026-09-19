export interface HotelBookingRow {
  id: number;
  booking_code: string;
  customer_name: string;
  customer_email: string;
  hotel_id: number;
  hotel_name: string;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  rooms_count: number;
  remaining_payment_status: string;
  operational_status: "upcoming" | "completed" | "cancelled" | "refunded" | "on_trip" | "in_stay" | "no_refunded_amount";
  payment_display: string;
  source: "website" | "admin";
  assigned_to: { id: number; full_name: string; profile_picture: string | null } | null;
  status: "pending" | "approved" | "rejected";
  payment_status: "pending" | "partially_paid" | "paid";
  total_price: string;
  refunded_amount?: string | null;
  currency: string;
  created_at: string;
}
