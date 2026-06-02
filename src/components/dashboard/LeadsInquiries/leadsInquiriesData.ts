import type { LeadRow, LeadSummaryMetric } from "./types";

export const leadSummaryMetrics: LeadSummaryMetric[] = [
  {
    label: "Plan Your Trip Leads",
    value: "1,284",
    change: "+8.2%",
    trend: "up",
    tone: "blue",
    icon: "plan-your-trip-leads",
  },
  {
    label: "MICE Requests",
    value: "1,284",
    change: "+8.2%",
    trend: "up",
    tone: "orange",
    icon: "mice",
  },
  {
    label: "B2B Partnership Inquiries",
    value: "1,284",
    change: "-5.1%",
    trend: "down",
    tone: "pink",
    icon: "b2b",
  },
  {
    label: "Contact",
    value: "1,284",
    change: "-5.1%",
    trend: "down",
    tone: "purple",
    icon: "contact",
  },
];

const baseLeads: Omit<LeadRow, "id">[] = [
  {
    name: "Ahmed Hassan",
    email: "josh_adam@mail.com",
    source: "B2B",
    date: "2024-03-15",
    status: "New",
    agent: "Sara M.",
  },
  {
    name: "Linda Blair",
    email: "lindablair@mail.com",
    source: "Contact",
    date: "2024-03-15",
    status: "In Progress",
    agent: "Sara M.",
  },
  {
    name: "Mohammad Karim",
    email: "m_karim@mail.com",
    source: "B2B",
    date: "2024-03-15",
    status: "New",
    agent: "Unassigned",
  },
  {
    name: "Ilham Budi Agung",
    email: "ilahmbudi@mail.com",
    source: "MICE",
    date: "2024-03-15",
    status: "New",
    agent: "Unassigned",
  },
  {
    name: "John Bushmill",
    email: "Johnb@mail.com",
    source: "Plan Your Trip",
    date: "2024-03-15",
    status: "New",
    agent: "Sara M.",
  },
];

export const mockLeads: LeadRow[] = Array.from({ length: 15 }, (_, index) => ({
  ...baseLeads[index % baseLeads.length],
  id: `LD-${String(index + 1).padStart(3, "0")}`,
}));
