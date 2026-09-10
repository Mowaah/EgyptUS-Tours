"use client";

import { useState } from "react";
import { useAdminDashboard } from "@/hooks/useDashboard";
import DestinationDonut from "./DestinationDonut/DestinationDonut";
import DistributionChart from "./DistributionChart/DistributionChart";
import { Legend } from "./Legend";
import { LineChart } from "./LineChart";
import { MetricCard } from "./MetricCard";
import { PanelHeader } from "./PanelHeader";
import PendingActions from "./PendingActions/PendingActions";
import type { DashboardRange } from "./SegmentedControl/SegmentedControl";
import { months } from "./dashboardHomeData";
import type {
  BookingDistribution,
  ChartLine,
  DashboardCards,
  DashboardPayload,
  DestinationItem,
  DistributionItem,
  DomesticOverviewRow,
  MetricCardData,
  PendingAction,
  PendingActionRaw,
  RevenueOverviewRow,
  Tone,
  Trend,
} from "./types";
import { formatCompactMetric, formatTrendPct } from "@/utils/formatMetric";
import styles from "./DashboardHome.module.scss";

const DESTINATION_COLORS = ["#A1CCFF", "#FFC6A0", "#FFD6DD", "#E9BDFF", "#B6F3D2"];

function toApiRange(range: DashboardRange): "month" | "year" {
  if (range === "Yearly") return "year";
  return "month";
}

function parseMoney(value: string): number {
  return Number(value.replace(/[^0-9.-]+/g, "")) || 0;
}

function formatTimeAgo(isoDate: string): string {
  const elapsed = Math.floor((Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60));
  if (elapsed > 24) return `${Math.floor(elapsed / 24)} days ago`;
  if (elapsed > 0) return `${elapsed} hours ago`;
  return "Just now";
}

function mapMetricCards(cards: DashboardCards): MetricCardData[] {
  const toTrend = (pct: string): Trend => (pct?.startsWith("-") ? "down" : "up");
  return [
    {
      label: "Total Bookings",
      value: formatCompactMetric(cards.total_bookings?.value, false),
      change: formatTrendPct(cards.total_bookings?.trend_pct),
      trend: toTrend(cards.total_bookings?.trend_pct),
      tone: "blue",
      icon: "total-bookings",
      spark: "",
    },
    /*
    {
      label: "Total Revenue",
      value: formatCompactMetric(cards.total_revenue?.value, true),
      change: formatTrendPct(cards.total_revenue?.trend_pct),
      trend: toTrend(cards.total_revenue?.trend_pct),
      tone: "green",
      icon: "total-revenue",
      spark: "",
    },
    {
      label: "Pending Confirmations",
      value: formatCompactMetric(cards.pending_confirmations?.value, false),
      change: formatTrendPct(cards.pending_confirmations?.trend_pct),
      trend: toTrend(cards.pending_confirmations?.trend_pct),
      tone: "orange",
      icon: "pending-confirmation",
      spark: "",
    },
    */
    {
      label: "New Leads",
      value: formatCompactMetric(cards.new_leads?.value, false),
      change: formatTrendPct(cards.new_leads?.trend_pct),
      trend: toTrend(cards.new_leads?.trend_pct),
      tone: "purple",
      icon: "new-leads",
      spark: "",
    },
    {
      label: "Upcoming Departures",
      value: formatCompactMetric(cards.upcoming_departures?.value, false),
      change: formatTrendPct(cards.upcoming_departures?.trend_pct),
      trend: toTrend(cards.upcoming_departures?.trend_pct),
      tone: "pink",
      icon: "upcoming-deartures",
      spark: "",
    },
    {
      label: "Outstanding Deposits",
      value: formatCompactMetric(cards.outstanding_deposits?.value, true),
      change: formatTrendPct(cards.outstanding_deposits?.trend_pct),
      trend: toTrend(cards.outstanding_deposits?.trend_pct),
      tone: "amber",
      icon: "outstanding-deposits",
      spark: "",
    },
  ];
}

function mapRevenueLines(rows: RevenueOverviewRow[]): ChartLine[] {
  if (!Array.isArray(rows)) return [];
  return [
    { name: "Trips", color: "#2E93FA", points: rows.map((r) => parseMoney(r.trip)) },
    { name: "Hotels", color: "#FF8B3D", points: rows.map((r) => parseMoney(r.hotel)) },
    { name: "Transportation", color: "#FB7D91", points: rows.map((r) => parseMoney(r.transport)) },
    { name: "MICE", color: "#A23DE0", points: rows.map((r) => parseMoney(r.mice)) },
  ];
}

const DEFAULT_REVENUE_LINES: ChartLine[] = [
  { name: "Trips", color: "#2E93FA", points: [] },
  { name: "Hotels", color: "#FF8B3D", points: [] },
  { name: "Transportation", color: "#FB7D91", points: [] },
  { name: "MICE", color: "#A23DE0", points: [] },
];

const DEFAULT_DOMESTIC_LINES: ChartLine[] = [
  { name: "inside Egypt", color: "#3894FF", areaColor: "#3894FF", points: [] },
  { name: "International", color: "#FFAA70", areaColor: "#FFAA70", points: [] },
];

function getYearlyLabels(): string[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => (currentYear - 4 + i).toString());
}

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function extractLabels(
  rows: Array<{ date?: string; month?: string; hour?: string }> | Record<string, number> | undefined,
  range: DashboardRange
): string[] {
  if (!Array.isArray(rows) || rows.length === 0) {
    return range === "Yearly" ? getYearlyLabels() : months;
  }
  return rows.map((r) => {
    const raw = r.month || r.date || r.hour || "";
    if (!raw) return "";

    if (r.month || range === "Monthly") {
      const parts = raw.split("-");
      if (parts.length >= 2) {
        const monthNum = parseInt(parts[1], 10);
        if (monthNum >= 1 && monthNum <= 12) {
          return MONTH_NAMES[monthNum - 1];
        }
      }
    }

    if (range === "Yearly") {
      const parts = raw.split("-");
      if (parts.length >= 1 && parts[0].length === 4) {
        return parts[0];
      }
      const d = new Date(raw);
      return !isNaN(d.getTime()) ? d.getFullYear().toString() : raw;
    }

    const d = new Date(raw);
    return !isNaN(d.getTime())
      ? d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
      : raw;
  });
}

function mapDomesticLines(rows: DomesticOverviewRow[] | Record<string, number> | undefined): ChartLine[] {
  if (!Array.isArray(rows)) return DEFAULT_DOMESTIC_LINES;
  return [
    { name: "inside Egypt", color: "#3894FF", areaColor: "#3894FF", points: rows.map((r) => r.domestic ?? 0) },
    { name: "International", color: "#FFAA70", areaColor: "#FFAA70", points: rows.map((r) => r.international ?? 0) },
  ];
}

function mapDestinations(payload: DashboardPayload): DestinationItem[] {
  return (payload.bookings_by_destination ?? []).map((d, i) => ({
    label: d.destination,
    value: d.booking_count,
    color: DESTINATION_COLORS[i % DESTINATION_COLORS.length],
  }));
}

function mapDistribution(dist: BookingDistribution, maxValue: number): DistributionItem[] {
  const safeMax = maxValue > 0 ? maxValue : 1;
  return [
    { label: "Trips", value: ((dist.trip ?? 0) / safeMax) * 100, displayValue: (dist.trip ?? 0).toString(), color: "#9CC7F7" },
    { label: "Hotels", value: ((dist.hotel ?? 0) / safeMax) * 100, displayValue: (dist.hotel ?? 0).toString(), color: "#FFD7BA" },
    { label: "Transport", value: ((dist.transport ?? 0) / safeMax) * 100, displayValue: (dist.transport ?? 0).toString(), color: "#FAD0D5" },
    { label: "MICE", value: ((dist.mice ?? 0) / safeMax) * 100, displayValue: (dist.mice ?? 0).toString(), color: "#E5C8F5" },
    { label: "B2B", value: ((dist.b2b ?? 0) / safeMax) * 100, displayValue: (dist.b2b ?? 0).toString(), color: "#B6F3D2" },
  ];
}

function mapPendingActions(actions: PendingActionRaw[]): PendingAction[] {
  const toneMap: Record<string, Tone> = {
    new_booking: "blue",
    unconfirmed_proposal: "orange",
    new_lead: "purple",
    overdue_deposit: "amber",
  };
  const iconMap: Record<string, string> = {
    new_booking: "pending-booking",
    unconfirmed_proposal: "pending-mice",
    new_lead: "pending-unread",
    overdue_deposit: "pending-payment",
  };
  return actions.map((a) => ({
    title: `${a.title}${a.related_object_id ? ` #${a.related_object_id}` : ""}`,
    time: formatTimeAgo(a.created_at),
    tone: toneMap[a.action_type] ?? "blue",
    icon: iconMap[a.action_type] ?? "pending-booking",
    path: a.path,
  }));
}

function getDistributionMax(dist: BookingDistribution): number {
  const maxVal = Math.max(dist.trip ?? 0, dist.hotel ?? 0, dist.transport ?? 0, dist.mice ?? 0, dist.b2b ?? 0, 5);
  let maxValue = Math.ceil(maxVal * 1.15);
  if (maxValue <= 0) maxValue = 10;

  let tickSize = maxValue / 5;
  const order = Math.pow(10, Math.floor(Math.log10(tickSize || 1)));
  const normalizedTick = tickSize / order;

  let niceTick;
  if (normalizedTick <= 1) niceTick = 1;
  else if (normalizedTick <= 2) niceTick = 2;
  else if (normalizedTick <= 2.5) niceTick = 2.5;
  else if (normalizedTick <= 5) niceTick = 5;
  else niceTick = 10;

  let step = niceTick * order;
  if (step === 0) step = 1;
  return step * 5;
}

function buildYAxisLabels(maxValue: number): string[] {
  const step = maxValue / 5;

  return Array.from({ length: 6 }, (_, i) => {
    const val = maxValue - step * i;
    return val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K` : Math.round(val).toString();
  });
}

export default function DashboardHome() {
  const [revenueRange, setRevenueRange] = useState<DashboardRange>("Monthly");
  const [bookingRange, setBookingRange] = useState<DashboardRange>("Monthly");

  // Base fetch for metric cards, destinations, distribution, and pending actions (always "month")
  const baseApi = useAdminDashboard("month");
  
  // Two separate fetches so each panel's range is independent
  const revenueApi = useAdminDashboard(toApiRange(revenueRange));
  const bookingApi = useAdminDashboard(toApiRange(bookingRange));

  const basePayload = baseApi.dashboardData;
  const revenuePayload = revenueApi.dashboardData;
  const bookingPayload = bookingApi.dashboardData;

  const metricCards = basePayload ? mapMetricCards(basePayload.cards) : [];

  const rawRevenue = revenuePayload?.revenue_overview;
  const revenueLines = rawRevenue && rawRevenue.length > 0 ? mapRevenueLines(rawRevenue) : DEFAULT_REVENUE_LINES;
  const revenueLabels = extractLabels(rawRevenue, revenueRange);
  
  const rawDomestic = bookingPayload?.domestic_vs_international;
  const domesticLines = Array.isArray(rawDomestic) && rawDomestic.length > 0 ? mapDomesticLines(rawDomestic) : DEFAULT_DOMESTIC_LINES;
  const domesticLabels = extractLabels(rawDomestic, bookingRange);
  
  const destinations = basePayload ? mapDestinations(basePayload) : [];
  /*
  const distMax = basePayload ? getDistributionMax(basePayload.booking_distribution ?? {} as BookingDistribution) : 10;
  const distribution = basePayload ? mapDistribution(basePayload.booking_distribution ?? {} as BookingDistribution, distMax) : [];
  const yAxisLabels = buildYAxisLabels(distMax);
  const pendingActions = basePayload ? mapPendingActions(basePayload.pending_actions ?? []) : [];
  */
  const totalBookings = destinations.reduce((sum, d) => sum + d.value, 0);

  const isBaseLoading = baseApi.isLoading;
  const isBaseError = baseApi.isError;

  if (isBaseLoading) {
    return <div className={styles.body} style={{ padding: "40px", textAlign: "center" }}>Loading dashboard...</div>;
  }

  if (isBaseError || !basePayload) {
    return <div className={styles.body} style={{ padding: "40px", color: "red" }}>Failed to load dashboard data.</div>;
  }

  return (
    <div className={styles.body}>
      <section className={styles.metricGrid} aria-label="Dashboard metrics">
        {metricCards.map((card) => (
          <MetricCard card={card} key={card.label} />
        ))}
      </section>

      <section className={styles.fullWidthGrid}>
        <article className={`${styles.panel} ${styles.revenuePanel}`}>
          <PanelHeader
            icon="revenue"
            title="Revenue Overview"
            subtitle={`${revenueRange} revenue by service type`}
            range={revenueRange}
            onRangeChange={setRevenueRange}
          />
          <LineChart lines={revenueLines} xAxisLabels={revenueLabels} />
          <Legend items={revenueLines} />
        </article>
      </section>

      <section className={styles.midGrid}>
        <article className={`${styles.panel} ${styles.destinationPanel}`}>
          <PanelHeader
            icon="booking-by-destination"
            title="Bookings by Destination"
            subtitle="Top destinations this period"
          />
          <DestinationDonut destinations={destinations} centerValue={totalBookings} />
        </article>

        <article className={`${styles.panel} ${styles.domesticPanel}`}>
          <PanelHeader
            icon="domestic"
            title="Domestic vs International Bookings"
            subtitle="Comparison of booking volume inside Egypt and outbound destinations"
            range={bookingRange}
            onRangeChange={setBookingRange}
          />
          <LineChart lines={domesticLines} area xAxisLabels={domesticLabels} />
          <Legend items={domesticLines} />
        </article>
      </section>

      {/*
      <section className={styles.bottomGrid}>
        <article className={`${styles.panel} ${styles.distributionPanel}`}>
          <PanelHeader
            icon="booking-distribution"
            title="Booking Distribution"
            subtitle="By service type"
          />
          <DistributionChart distribution={distribution} yAxisLabels={yAxisLabels} />
        </article>

        <article className={`${styles.panel} ${styles.actionsPanel}`}>
          <PanelHeader
            icon="pending-actions"
            title="Pending Actions"
            subtitle="Items requiring your attention"
          />
          <PendingActions pendingActions={pendingActions} />
        </article>
      </section>
      */}
    </div>
  );
}
