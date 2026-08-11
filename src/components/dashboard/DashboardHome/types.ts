export type Tone = "blue" | "green" | "orange" | "purple" | "pink" | "amber" | "red";
export type Trend = "up" | "down";

export interface MetricCardData {
  label: string;
  value: string;
  change: string;
  trend: Trend;
  tone: Tone;
  icon: string;
  spark: string;
}

export interface ChartLine {
  name: string;
  color: string;
  areaColor?: string;
  points: number[];
}

export interface DistributionItem {
  label: string;
  value: number;
  color: string;
  displayValue?: string;
}

export interface DestinationItem {
  label: string;
  value: number;
  color: string;
}

export interface PendingAction {
  title: string;
  time: string;
  tone: Tone;
  icon: string;
  path: string;
}

// Backend API response interfaces
export interface DashboardCardKpi {
  value: number | string;
  trend_pct: string;
  series: Array<{ date: string; value: number | string }>;
}

export interface DashboardCards {
  total_bookings: DashboardCardKpi;
  total_revenue: DashboardCardKpi;
  pending_confirmations: DashboardCardKpi;
  new_leads: DashboardCardKpi;
  upcoming_departures: DashboardCardKpi;
  outstanding_deposits: DashboardCardKpi;
}

export interface RevenueOverviewRow {
  date: string;
  trip: string;
  hotel: string;
  transport: string;
  mice: string;
  b2b: string;
}

export interface DomesticOverviewRow {
  date: string;
  domestic: number;
  international: number;
  unknown: number;
}

export interface BookingDestinationRow {
  destination: string;
  booking_count: number;
}

export interface BookingDistribution {
  trip: number;
  hotel: number;
  transport: number;
  mice: number;
  b2b: number;
}

export interface PendingActionRaw {
  action_type: string;
  title: string;
  description: string;
  related_object_type: string;
  related_object_id: number;
  created_at: string;
  path: string;
}

export interface DashboardPayload {
  cards: DashboardCards;
  revenue_overview: RevenueOverviewRow[];
  bookings_by_destination: BookingDestinationRow[];
  domestic_vs_international: DomesticOverviewRow[];
  booking_distribution: BookingDistribution;
  pending_actions: PendingActionRaw[];
  range: string;
  date_from: string;
  date_to: string;
}
