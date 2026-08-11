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
import styles from "./DashboardHome.module.scss";

const DESTINATION_COLORS = ["#A1CCFF", "#FFC6A0", "#FFD6DD", "#E9BDFF", "#B6F3D2"];

function toApiRange(range: DashboardRange): "today" | "this_week" | "this_month" {
  if (range === "Today") return "today";
  if (range === "Week") return "this_week";
  return "this_month";
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
    { label: "Total Bookings", value: String(cards.total_bookings?.value ?? 0), change: cards.total_bookings?.trend_pct ?? "0%", trend: toTrend(cards.total_bookings?.trend_pct), tone: "blue", icon: "total-bookings", spark: "" },
    { label: "Total Revenue", value: String(cards.total_revenue?.value ?? "$0"), change: cards.total_revenue?.trend_pct ?? "0%", trend: toTrend(cards.total_revenue?.trend_pct), tone: "green", icon: "total-revenue", spark: "" },
    { label: "Pending Confirmations", value: String(cards.pending_confirmations?.value ?? 0), change: cards.pending_confirmations?.trend_pct ?? "0%", trend: toTrend(cards.pending_confirmations?.trend_pct), tone: "orange", icon: "pending-confirmation", spark: "" },
    { label: "New Leads", value: String(cards.new_leads?.value ?? 0), change: cards.new_leads?.trend_pct ?? "0%", trend: toTrend(cards.new_leads?.trend_pct), tone: "purple", icon: "new-leads", spark: "" },
    { label: "Upcoming Departures", value: String(cards.upcoming_departures?.value ?? 0), change: cards.upcoming_departures?.trend_pct ?? "0%", trend: toTrend(cards.upcoming_departures?.trend_pct), tone: "pink", icon: "upcoming-deartures", spark: "" },
    { label: "Outstanding Deposits", value: String(cards.outstanding_deposits?.value ?? "$0"), change: cards.outstanding_deposits?.trend_pct ?? "0%", trend: toTrend(cards.outstanding_deposits?.trend_pct), tone: "amber", icon: "outstanding-deposits", spark: "" },
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

function extractLabels(rows: { date: string }[], range: DashboardRange): string[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => {
    const d = new Date(r.date);
    if (range === "Today") return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (range === "Week") return d.toLocaleDateString(undefined, { weekday: 'short' });
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  });
}

function mapDomesticLines(rows: DomesticOverviewRow[]): ChartLine[] {
  if (!Array.isArray(rows)) return [];
  return [
    { name: "Inside Egypt", color: "rgba(41, 113, 230, 0.7)", areaColor: "#8DC1FF", points: rows.map((r) => r.domestic) },
    { name: "International", color: "#FFD0B0", areaColor: "#FFEDD5", points: rows.map((r) => r.international) },
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
  const [revenueRange, setRevenueRange] = useState<DashboardRange>("Month");
  const [bookingRange, setBookingRange] = useState<DashboardRange>("Month");

  // Base fetch for metric cards, destinations, distribution, and pending actions (always "Month")
  const baseApi = useAdminDashboard("this_month");
  
  // Two separate fetches so each panel's range is independent
  const revenueApi = useAdminDashboard(toApiRange(revenueRange));
  const bookingApi = useAdminDashboard(toApiRange(bookingRange));

  const basePayload = baseApi.dashboardData;
  const revenuePayload = revenueApi.dashboardData;
  const bookingPayload = bookingApi.dashboardData;

  const metricCards = basePayload ? mapMetricCards(basePayload.cards) : [];
  const revenueLines = revenuePayload ? mapRevenueLines(revenuePayload.revenue_overview ?? []) : [];
  const revenueLabels = revenuePayload ? extractLabels(revenuePayload.revenue_overview ?? [], revenueRange) : undefined;
  
  const domesticLines = bookingPayload ? mapDomesticLines(bookingPayload.domestic_vs_international ?? []) : [];
  const domesticLabels = bookingPayload ? extractLabels(bookingPayload.domestic_vs_international ?? [], bookingRange) : undefined;
  
  const destinations = basePayload ? mapDestinations(basePayload) : [];
  const distMax = basePayload ? getDistributionMax(basePayload.booking_distribution ?? {} as BookingDistribution) : 10;
  const distribution = basePayload ? mapDistribution(basePayload.booking_distribution ?? {} as BookingDistribution, distMax) : [];
  const yAxisLabels = buildYAxisLabels(distMax);
  const pendingActions = basePayload ? mapPendingActions(basePayload.pending_actions ?? []) : [];
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
            subtitle={`${bookingRange} comparison inside Egypt and outbound destinations`}
            range={bookingRange}
            onRangeChange={setBookingRange}
          />
          {bookingApi.isLoading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
          ) : domesticLines.length > 0 ? (
            <>
              <LineChart lines={domesticLines} area xAxisLabels={domesticLabels} />
              <Legend items={domesticLines} />
            </>
          ) : (
            <div style={{ padding: "40px", textAlign: "center" }}>No data available</div>
          )}
        </article>
      </section>

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
    </div>
  );
}
