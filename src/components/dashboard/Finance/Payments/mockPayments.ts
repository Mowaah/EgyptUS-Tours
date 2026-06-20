export interface PaymentRow {
  id: string;
  bookingId: string;
  customer: string;
  service: "MICE" | "Trips" | "Hotels" | "Transportation" | "B2B";
  dates: string;
  method: "Credit Card" | "Bank Transfer";
  status: "Fully Paid" | "Refunded";
}

export const mockPayments: PaymentRow[] = [
  {
    id: "PAY-001",
    bookingId: "BK-2026-001",
    customer: "Ahmed Hassan",
    service: "MICE",
    dates: "2024-07-15",
    method: "Credit Card",
    status: "Fully Paid",
  },
  {
    id: "PAY-002",
    bookingId: "BK-2026-002",
    customer: "Linda Blair",
    service: "Trips",
    dates: "2024-07-15",
    method: "Bank Transfer",
    status: "Refunded",
  },
  {
    id: "PAY-003",
    bookingId: "BK-2026-003",
    customer: "Mohammad Karim",
    service: "Trips",
    dates: "2024-07-15",
    method: "Bank Transfer",
    status: "Fully Paid",
  },
  {
    id: "PAY-004",
    bookingId: "BK-2026-004",
    customer: "Ilham Budi Agung",
    service: "Hotels",
    dates: "2024-07-15",
    method: "Bank Transfer",
    status: "Refunded",
  },
  {
    id: "PAY-005",
    bookingId: "BK-2026-005",
    customer: "John Bushmill",
    service: "Hotels",
    dates: "2024-07-15",
    method: "Credit Card",
    status: "Fully Paid",
  },
  {
    id: "PAY-006",
    bookingId: "BK-2026-006",
    customer: "Linda Blair",
    service: "Transportation",
    dates: "2024-07-15",
    method: "Credit Card",
    status: "Fully Paid",
  },
  {
    id: "PAY-007",
    bookingId: "BK-2026-007",
    customer: "Josh Adam",
    service: "B2B",
    dates: "2024-07-15",
    method: "Credit Card",
    status: "Fully Paid",
  },
  {
    id: "PAY-008",
    bookingId: "BK-2026-008",
    customer: "Linda Blair",
    service: "B2B",
    dates: "2024-07-15",
    method: "Credit Card",
    status: "Fully Paid",
  },
];
