import type { LeadRow, LeadSummaryMetric } from "./types";

export const leadSummaryMetrics: LeadSummaryMetric[] = [
  {
    label: "Total Leads",
    value: "1,284",
    change: "+8.2%",
    trend: "up",
    tone: "blue",
    icon: "total_leads",
  },
  {
    label: "New Leads",
    value: "1,284",
    change: "+8.2%",
    trend: "up",
    tone: "orange",
    icon: "new_leads",
  },
  {
    label: "In Progress",
    value: "1,284",
    change: "-5.1%",
    trend: "down",
    tone: "pink",
    icon: "in_progress",
  },
  {
    label: "Converted Leads",
    value: "1,284",
    change: "-5.1%",
    trend: "down",
    tone: "purple",
    icon: "converted_leads",
  },
];

const baseLeads: Omit<LeadRow, "id">[] = [
  {
    name: "Ahmed Hassan",
    phone: "01100402885",
    email: "josh_adam@mail.com",
    source: "Facebook",
    date: "2024-03-15",
    status: "New",
    agent: "Sara M.",
  },
  {
    name: "Linda Blair",
    phone: "01100402885",
    email: "lindablair@mail.com",
    source: "Walk-in",
    date: "2024-03-15",
    status: "Closed",
    agent: "Sara M.",
  },
  {
    name: "Mohammad Karim",
    phone: "01100402885",
    email: "m_karim@mail.com",
    source: "Phone Call",
    date: "2024-03-15",
    status: "Qualified",
    agent: "Sara M.",
  },
  {
    name: "Ilham Budi Agung",
    phone: "01100402885",
    email: "ilahmbudi@mail.com",
    source: "Whatsup",
    date: "2024-03-15",
    status: "Converted",
    agent: "Sara M.",
  },
  {
    name: "John Bushmill",
    phone: "01100402885",
    email: "Johnb@mail.com",
    source: "Email",
    date: "2024-03-15",
    status: "Contacted",
    agent: "Sara M.",
  },
];

export const mockLeads: LeadRow[] = Array.from({ length: 15 }, (_, index) => ({
  ...baseLeads[index % baseLeads.length],
  id: `LD-${String(index + 1).padStart(3, "0")}`,
}));

import type { ImportLeadRow } from "./types";

export const mockImportLeads: ImportLeadRow[] = [
  { batchId: "IMP-001", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 200, unassigned: 200, assignedTeam: ["Operations", "Sales"] },
  { batchId: "IMP-002", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 200, unassigned: 200, assignedTeam: ["Sales"] },
  { batchId: "IMP-003", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 200, unassigned: 200, assignedTeam: ["Operations"] },
  { batchId: "IMP-004", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 200, unassigned: 200, assignedTeam: ["Operations"] },
  { batchId: "IMP-005", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 200, unassigned: 200, assignedTeam: ["Sales"] },
  { batchId: "IMP-006", importDate: "2024-03-15", importedBy: "Linda Blair", totalLeads: 480, assigned: 200, unassigned: 200, assignedTeam: ["Sales"] },
  { batchId: "IMP-007", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 200, unassigned: 200, assignedTeam: ["Sales"] },
  { batchId: "IMP-008", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 200, unassigned: 200, assignedTeam: ["Sales"] },
  { batchId: "IMP-009", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 200, unassigned: 200, assignedTeam: ["Sales"] },
  { batchId: "IMP-010", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 200, unassigned: 200, assignedTeam: ["Sales"] },
  { batchId: "IMP-011", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 400, unassigned: null, assignedTeam: ["Sales"] },
  { batchId: "IMP-012", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 400, unassigned: null, assignedTeam: ["Sales"] },
  { batchId: "IMP-013", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 400, unassigned: null, assignedTeam: ["Sales"] },
  { batchId: "IMP-014", importDate: "2024-03-15", importedBy: "Sara M.", totalLeads: 480, assigned: 400, unassigned: null, assignedTeam: ["Sales"] },
];
