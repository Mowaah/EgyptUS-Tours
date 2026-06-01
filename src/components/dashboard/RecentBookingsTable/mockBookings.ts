import type { BookingRow } from "./types";

export const mockBookings: BookingRow[] = [
  { id: "BK-1284", customer: "Josh Adam", service: "MICE", destination: "Luxor & Aswan", date: "Jan 15, 2026", price: "$ 78,900", status: "Cancelled" },
  { id: "BK-1283", customer: "Linda Blair", service: "Trips", destination: "Cairo - Marriott", date: "Jan 14, 2026", price: "$ 78,900", status: "Cancelled" },
  { id: "BK-1282", customer: "Mohammad Karim", service: "Transport", destination: "Sharm El Sheikh", date: "Jan 14, 2026", price: "$ 78,900", status: "Pending" },
  { id: "BK-1281", customer: "Ilham Budi Agung", service: "Hotels", destination: "Pyramids Day Tour", date: "Jan 14, 2026", price: "$ 78,900", status: "Pending" },
  { id: "BK-1280", customer: "John Bushmill", service: "Hotels", destination: "Cairo Airport", date: "Jan 14, 2026", price: "$ 78,900", status: "Confirmed" },
];
