"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import DestinationDonut from "./DestinationDonut";
import DistributionChart from "./DistributionChart";
import Legend from "./Legend";
import LineChart from "./LineChart";
import MetricCard from "./MetricCard";
import PanelHeader from "./PanelHeader";
import PendingActions from "./PendingActions";
import RecentBookingsTable from "./RecentBookingsTable";
import { domesticLines, metricCards, revenueLines } from "./dashboardHomeData";
import { ChevronRightIcon } from "../Navbar/DashboardNavbar";
import type { ChartLine } from "./types";
import type { DashboardRange } from "./SegmentedControl";
import styles from "./DashboardHome.module.scss";

const rangeFactors: Record<DashboardRange, number[]> = {
  Today: [0.36, 0.52, 0.48, 0.68, 0.42, 0.78, 0.61, 0.7, 0.55, 0.74, 0.66, 0.82],
  Week: [0.72, 0.78, 0.63, 0.88, 0.82, 0.92, 0.76, 0.86, 0.81, 0.9, 0.84, 0.95],
  Month: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};

function applyRange(lines: ChartLine[], range: DashboardRange) {
  const factors = rangeFactors[range];

  return lines.map((line, lineIndex) => ({
    ...line,
    points: line.points.map((point, pointIndex) => {
      const offset = lineIndex % 2 === 0 ? 1 : 0.92;
      return Math.round(point * factors[pointIndex] * offset);
    }),
  }));
}

export default function DashboardHome() {
  const [revenueRange, setRevenueRange] = useState<DashboardRange>("Month");
  const [bookingRange, setBookingRange] = useState<DashboardRange>("Month");
  const revenueChartLines = useMemo(() => applyRange(revenueLines, revenueRange), [revenueRange]);
  const bookingChartLines = useMemo(() => applyRange(domesticLines, bookingRange), [bookingRange]);

  return (
    <div className={styles.dashboardBody}>
      <section className={styles.metricGrid} aria-label="Dashboard metrics">
        {metricCards.map((card) => <MetricCard card={card} key={card.label} />)}
      </section>

      <section className={styles.analyticsGrid}>
        <article className={`${styles.panel} ${styles.revenuePanel}`}>
          <PanelHeader icon="revenue" title="Revenue Overview" subtitle={`${revenueRange} revenue by service type`} range={revenueRange} onRangeChange={setRevenueRange} />
          <LineChart lines={revenueChartLines} />
          <Legend items={revenueChartLines} />
        </article>

        <article className={`${styles.panel} ${styles.distributionPanel}`}>
          <PanelHeader icon="booking-distribution" title="Booking Distribution" subtitle="By service type" />
          <DistributionChart />
        </article>
      </section>

      <section className={styles.midGrid}>
        <article className={`${styles.panel} ${styles.destinationPanel}`}>
          <PanelHeader icon="booking-by-destination" title="Bookings by Destination" subtitle="Top destinations this quarter" />
          <DestinationDonut />
        </article>

        <article className={`${styles.panel} ${styles.domesticPanel}`}>
          <PanelHeader icon="domestic" title="Domestic vs International Bookings" subtitle={`${bookingRange} comparison inside Egypt and outbound destinations`} range={bookingRange} onRangeChange={setBookingRange} />
          <LineChart lines={bookingChartLines} area />
          <Legend items={bookingChartLines} />
        </article>
      </section>

      <section className={styles.bottomGrid}>
        <article className={`${styles.panel} ${styles.bookingsPanel}`}>
          <div className={styles.tableHeader}>
            <PanelHeader icon="recent-bookings" title="Recent Bookings" badge="Last 7 bookings across all services" />
            <a href="#" className={styles.viewAllLink}>
              View All
              <ChevronRightIcon className={styles.viewAllChevron} />
            </a>
          </div>
          <RecentBookingsTable />
        </article>

        <article className={`${styles.panel} ${styles.actionsPanel}`}>
          <PanelHeader icon="pending-actions" title="Pending Actions" subtitle="Items requiring your attention" />
          <PendingActions />
        </article>
      </section>
    </div>
  );
}
