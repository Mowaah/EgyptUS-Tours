export type LeadSource = "B2B" | "Contact" | "MICE" | "Plan Your Trip";
export type LeadStatus = "New" | "In Progress" | "Converted";

export interface LeadRow {
  id: string;
  name: string;
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
