export type LeadSource = string;
export type LeadStatus = string;

export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  date: string;
  status: LeadStatus;
  agent: string;
}

export interface LeadSummaryMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  tone: "blue" | "orange" | "pink" | "purple";
  icon: string;
}

export type TeamType = "Operations" | "Sales";

export interface ImportLeadRow {
  batchId: string;
  importDate: string;
  importedBy: string;
  totalLeads: number;
  assigned: number;
  unassigned: number | null;
  assignedTeam: TeamType[];
}
