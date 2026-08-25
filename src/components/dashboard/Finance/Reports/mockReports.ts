export interface ReportRow {
  id: string;
  product: string;
  type: "Plan Your Trip" | "MICE" | "B2B" | "Transport";
  bookings: number;
  revenue: string;
  margin: string;
  trendValue: string;
  trendDirection: "up" | "down";
}

export const mockReports: ReportRow[] = [
  {
    id: "1",
    product: "Pyramids & Cairo 5D/4N",
    type: "Plan Your Trip",
    bookings: 4566,
    revenue: "£78,900",
    margin: "38%",
    trendValue: "+8.2%",
    trendDirection: "up",
  },
  {
    id: "2",
    product: "MICE Conference Package",
    type: "MICE",
    bookings: 646,
    revenue: "£78,900",
    margin: "42%",
    trendValue: "-5.1%",
    trendDirection: "down",
  },
  {
    id: "3",
    product: "Luxor & Aswan Cruise 7D",
    type: "B2B",
    bookings: 4376,
    revenue: "£78,900",
    margin: "28%",
    trendValue: "+8.2%",
    trendDirection: "up",
  },
  {
    id: "4",
    product: "Red Sea Resort All-Inc",
    type: "Transport",
    bookings: 573737,
    revenue: "£78,900",
    margin: "28%",
    trendValue: "-5.1%",
    trendDirection: "down",
  },
  {
    id: "5",
    product: "Siwa Oasis Adventure 4D",
    type: "Plan Your Trip",
    bookings: 57547,
    revenue: "£78,900",
    margin: "28%",
    trendValue: "-5.1%",
    trendDirection: "down",
  },
  {
    id: "6",
    product: "Alexandria Day Tour",
    type: "MICE",
    bookings: 57547,
    revenue: "£78,900",
    margin: "28%",
    trendValue: "+8.2%",
    trendDirection: "up",
  },
];
