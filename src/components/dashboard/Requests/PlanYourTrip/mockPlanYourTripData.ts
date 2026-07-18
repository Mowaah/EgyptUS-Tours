export interface PlanYourTripItem {
  id: string;
  ref: string;
  name: string;
  destination: string;
  dates: string;
  pax: string;
  submittedOn: string;
  source: "Website" | "Agent";
  status: string;
  agent: string;
}

export const mockPlanYourTrips: PlanYourTripItem[] = [
  {
    id: "trip-1",
    ref: "CTP-001",
    name: "Ahmed Hassan",
    destination: "Egypt...",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/1C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "New",
    agent: "------",
  },
  {
    id: "trip-2",
    ref: "CTP-002",
    name: "Sara Mohamed",
    destination: "Dubai",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/2C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Agent",
    status: "Fully Paid",
    agent: "Sara M.",
  },
  {
    id: "trip-3",
    ref: "CTP-003",
    name: "John Smith",
    destination: "Egypt...",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/1C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "Proposal Ready",
    agent: "Sara M.",
  },
  {
    id: "trip-4",
    ref: "CTP-004",
    name: "Emma Watson",
    destination: "Dubai",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/2C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Agent",
    status: "Proposal Sent",
    agent: "Sara M.",
  },
  {
    id: "trip-5",
    ref: "CTP-005",
    name: "Michael Chen",
    destination: "Egypt...",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/1C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "Rejected",
    agent: "Sara M.",
  },
  {
    id: "trip-6",
    ref: "CTP-006",
    name: "Sophia Ali",
    destination: "Dubai",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/2C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "Negotiation",
    agent: "Sara M.",
  },
  {
    id: "trip-7",
    ref: "CTP-007",
    name: "James Bond",
    destination: "Egypt...",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/1C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "30% Pending Payment",
    agent: "Sara M.",
  },
  {
    id: "trip-8",
    ref: "CTP-008",
    name: "Elena Rodriguez",
    destination: "Dubai",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/2C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "Deposit Paid",
    agent: "Sara M.",
  },
  {
    id: "trip-9",
    ref: "CTP-009",
    name: "Lucas Silva",
    destination: "Egypt...",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "1A/0C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "Fully Paid",
    agent: "Unassigned",
  },
  {
    id: "trip-10",
    ref: "CTP-010",
    name: "Yousef Omar",
    destination: "Dubai",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/0C/1I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "In Trip",
    agent: "Unassigned...",
  },
  {
    id: "trip-11",
    ref: "CTP-011",
    name: "Maria Garcia",
    destination: "Egypt...",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "4A/0C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "Completed",
    agent: "Sara M.",
  },
  {
    id: "trip-12",
    ref: "CTP-012",
    name: "David Kim",
    destination: "Dubai",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/1C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "Cancelled",
    agent: "Sara M.",
  },
  {
    id: "trip-13",
    ref: "CTP-013",
    name: "Fatima Noor",
    destination: "Egypt...",
    dates: "2024-07-15 -> 2024-07-22",
    pax: "2A/1C/0I",
    submittedOn: "Apr 10, 2026 • 12:30 PM...",
    source: "Website",
    status: "Refund Completed",
    agent: "Sara M.",
  },
];

export function getPlanYourTripDetails(id: string) {
  const summary = mockPlanYourTrips.find((t) => t.id === id) || mockPlanYourTrips[0];
  
  return {
    id: summary.ref,
    name: summary.name, // Dynamic name from summary
    status: summary.status,
    date: summary.submittedOn,
    customer: {
      name: summary.name,
      email: `${summary.name.split(' ')[0].toLowerCase()}@email.com`,
      phone: "+20 110 5555001",
      nationality: "Egyptian",
    },
    preferences: {
      destinations: summary.destination === "Egypt..." ? "Cairo, Luxor, Aswan" : summary.destination,
      startDate: "Mar 22, 2026 · 10:30 AM",
      endDate: "Mar 22, 2026 · 10:30 AM",
      travelers: summary.pax,
    },
    details: {
      category: "Luxury Tour , Luxury Tour , Luxury Tour",
      duration: "1-3 Days",
      budget: "$500 - $1,000",
      hotelCategory: 5.0,
      roomType: "Standard Room , Standard Room , Standard Room",
      transportation: "Private Transport",
      additionalExperience: "Private Tour Guide , Private Tour Guide , Private Tour Guide",
      activities: "Snorkeling & Diving, Snorkeling & Diving",
      contactMethod: "Whatsapp",
      specialRequest: "We are looking for a complete tourism management solution to manage bookings, customer inquiries, transportation services, and partner coordination more efficiently.",
    },
    paymentOverview: {
      paymentPlan: "30% Deposit",
      paymentMethod: "Paymob",
      totalPackage: 2500,
      depositAmount: 750,
      remainingAmount: 1750
    }
  };
}
