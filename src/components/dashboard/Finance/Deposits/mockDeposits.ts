export interface DepositRow {
  id: string;
  bookingId: string;
  customer: string;
  service: "Trips" | "Hotels" | "Transportation" | "B2B" | "MICE";
  dates: string;
  totalAmount: string;
  deposit: string;
  remainingBalance: string;
  dueDate: string;
  status: "Pending" | "Overdue";
  daysOverdue: string | null;
}

export const mockDeposits: DepositRow[] = [
  {
    id: "dep-001",
    bookingId: "BK-2026-001",
    customer: "Ahmed Hassan",
    service: "MICE",
    dates: "2024-07-15",
    totalAmount: "£78,900",
    deposit: "£78,900",
    remainingBalance: "£78,900",
    dueDate: "2024-07-15",
    status: "Pending",
    daysOverdue: null,
  },
  {
    id: "dep-002",
    bookingId: "BK-2026-001",
    customer: "Linda Blair",
    service: "Trips",
    dates: "2024-07-15",
    totalAmount: "£78,900",
    deposit: "£78,900",
    remainingBalance: "£78,900",
    dueDate: "2024-07-15",
    status: "Overdue",
    daysOverdue: "8 days",
  },
  {
    id: "dep-003",
    bookingId: "BK-2026-001",
    customer: "Mohammad Karim",
    service: "Trips",
    dates: "2024-07-15",
    totalAmount: "£78,900",
    deposit: "£78,900",
    remainingBalance: "£78,900",
    dueDate: "2024-07-15",
    status: "Pending",
    daysOverdue: null,
  },
  {
    id: "dep-004",
    bookingId: "BK-2026-001",
    customer: "Ilham Budi Agung",
    service: "Hotels",
    dates: "2024-07-15",
    totalAmount: "£78,900",
    deposit: "£78,900",
    remainingBalance: "£78,900",
    dueDate: "2024-07-15",
    status: "Overdue",
    daysOverdue: "8 days",
  },
  {
    id: "dep-005",
    bookingId: "BK-2026-001",
    customer: "John Bushmill",
    service: "Hotels",
    dates: "2024-07-15",
    totalAmount: "£78,900",
    deposit: "£78,900",
    remainingBalance: "£78,900",
    dueDate: "2024-07-15",
    status: "Pending",
    daysOverdue: null,
  },
  {
    id: "dep-006",
    bookingId: "BK-2026-001",
    customer: "Linda Blair",
    service: "Transportation",
    dates: "2024-07-15",
    totalAmount: "£78,900",
    deposit: "£78,900",
    remainingBalance: "£78,900",
    dueDate: "2024-07-15",
    status: "Overdue",
    daysOverdue: "8 days",
  },
  {
    id: "dep-007",
    bookingId: "BK-2026-001",
    customer: "Josh Adam",
    service: "B2B",
    dates: "2024-07-15",
    totalAmount: "£78,900",
    deposit: "£78,900",
    remainingBalance: "£78,900",
    dueDate: "2024-07-15",
    status: "Pending",
    daysOverdue: null,
  },
  {
    id: "dep-008",
    bookingId: "BK-2026-001",
    customer: "Linda Blair",
    service: "B2B",
    dates: "2024-07-15",
    totalAmount: "£78,900",
    deposit: "£78,900",
    remainingBalance: "£78,900",
    dueDate: "2024-07-15",
    status: "Pending",
    daysOverdue: null,
  },
];
