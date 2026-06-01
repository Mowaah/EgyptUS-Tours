export type Tone = "blue" | "green" | "orange" | "purple" | "pink" | "amber";
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
}

export interface DestinationItem {
  label: string;
  value: number;
  color: string;
}

export interface PendingAction {
  title: string;
  time: string;
  tone: "red" | "amber" | "blue";
  icon: string;
}
