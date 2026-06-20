export interface CustomTripItem {
  id: string;
  ref: string;
  destination: string;
  dates: string;
  pax: string;
  source: "Website" | "Agent";
  status: "Completed" | "In Progress" | "On Hold" | "Negotiation" | "Rejected" | "Proposal Sent";
  agent: string;
}

export const mockCustomTrips: CustomTripItem[] = [
  {
    id: "ctp-1",
    ref: "#CTP-002",
    destination: "Egypt...",
    dates: "2024-07-15 → 2024-07-22",
    pax: "2A/1C/0I",
    source: "Website",
    status: "Completed",
    agent: "Sara M.",
  },
  {
    id: "ctp-2",
    ref: "#CTP-002",
    destination: "Dubai",
    dates: "2024-07-15 → 2024-07-22",
    pax: "2A/2C/0I",
    source: "Agent",
    status: "In Progress",
    agent: "Sara M.",
  },
  {
    id: "ctp-3",
    ref: "#CTP-002",
    destination: "Egypt...",
    dates: "2024-07-15 → 2024-07-22",
    pax: "2A/1C/0I",
    source: "Website",
    status: "On Hold",
    agent: "Sara M.",
  },
  {
    id: "ctp-4",
    ref: "#CTP-002",
    destination: "Dubai",
    dates: "2024-07-15 → 2024-07-22",
    pax: "2A/2C/0I",
    source: "Agent",
    status: "In Progress",
    agent: "Sara M.",
  },
  {
    id: "ctp-5",
    ref: "#CTP-002",
    destination: "Egypt...",
    dates: "2024-07-15 → 2024-07-22",
    pax: "2A/1C/0I",
    source: "Website",
    status: "Completed",
    agent: "Sara M.",
  },
  {
    id: "ctp-6",
    ref: "#CTP-002",
    destination: "Dubai",
    dates: "2024-07-15 → 2024-07-22",
    pax: "2A/2C/0I",
    source: "Website",
    status: "On Hold",
    agent: "Sara M.",
  },
  {
    id: "ctp-7",
    ref: "#CTP-002",
    destination: "Egypt...",
    dates: "2024-07-15 → 2024-07-22",
    pax: "2A/1C/0I",
    source: "Website",
    status: "Negotiation",
    agent: "Sara M.",
  },
  {
    id: "ctp-8",
    ref: "#CTP-002",
    destination: "Dubai",
    dates: "2024-07-15 → 2024-07-22",
    pax: "2A/2C/0I",
    source: "Website",
    status: "Rejected",
    agent: "Sara M.",
  },
  {
    id: "ctp-9",
    ref: "#CTP-002",
    destination: "Egypt...",
    dates: "2024-07-15 → 2024-07-22",
    pax: "1A/0C/0I",
    source: "Website",
    status: "In Progress",
    agent: "Unassigned",
  },
  {
    id: "ctp-10",
    ref: "#CTP-002",
    destination: "Dubai",
    dates: "2024-07-15 → 2024-07-22",
    pax: "2A/0C/1I",
    source: "Website",
    status: "Rejected",
    agent: "Unassigned...",
  },
];
