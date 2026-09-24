"use client";

import { ReactNode, useState, useMemo } from "react";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import styles from "./MiceRevenueByEventType.module.scss";

interface MiceRevenueByEventTypeProps {
  data?: { event_type: string; proposal_count: number }[];
  actions?: ReactNode;
}

const COLORS = ["#8DC1FF", "#FDBA74", "#FFD1DE", "#E9BDFF", "#FDE68A", "#C4B5FD", "#D1D5DB", "#86EFAC"];
const PAGE_SIZE_OPTIONS = [4, 8, 12];

const DEFAULT_EVENT_TYPES = [
  { event_type: "Conference", proposal_count: 0 },
  { event_type: "Meeting", proposal_count: 0 },
  { event_type: "Incentive Travel", proposal_count: 0 },
  { event_type: "Exhibition", proposal_count: 0 },
  { event_type: "Corporate Retreat", proposal_count: 0 },
];

export default function MiceRevenueByEventType({ data = [], actions }: MiceRevenueByEventTypeProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const displayData = useMemo(() => {
    if (data && data.length > 0) {
      return data;
    }
    return DEFAULT_EVENT_TYPES;
  }, [data]);

  const maxY = useMemo(() => {
    const max = Math.max(...displayData.map((d) => d.proposal_count), 0);
    if (max === 0) return 5;
    const step = Math.ceil(max / 5) || 1;
    return step * 5;
  }, [displayData]);

  const yAxisLabels = useMemo(() => {
    const step = maxY / 5;
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      labels.push((step * i).toString());
    }
    return labels;
  }, [maxY]);

  const pageCount = Math.max(1, Math.ceil(displayData.length / pageSize));
  const safePage = Math.min(page, pageCount);

  const pagedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return displayData.slice(start, start + pageSize);
  }, [displayData, safePage, pageSize]);

  const chartData = useMemo(() => {
    return pagedData.map((item, index) => {
      const globalIndex = (safePage - 1) * pageSize + index;
      return {
        label: item.event_type,
        value: maxY > 0 ? (item.proposal_count / maxY) * 100 : 0,
        displayValue: item.proposal_count.toString(),
        color: COLORS[globalIndex % COLORS.length],
      };
    });
  }, [pagedData, maxY, safePage, pageSize]);

  const barWidth = useMemo(() => {
    const count = chartData.length;
    if (count <= 4) return 68;
    if (count <= 6) return 60;
    if (count <= 8) return 46;
    return 32;
  }, [chartData.length]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  return (
    <article className={`${parentStyles.chartCard} ${styles.card}`}>
      <PanelHeader
        icon="customers/overview/service"
        title="Proposals by Event Type"
        actions={actions}
      />
      
      <div className={styles.chartWrapper}>
        <HatchedBarChart 
          data={chartData} 
          yAxisLabels={yAxisLabels} 
          barWidth={barWidth}
          className={styles.chart}
        />
      </div>

      <div className={styles.paginationWrapper}>
        <TablePagination
          page={safePage}
          pageCount={pageCount}
          rowsPerPage={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
        />
      </div>
    </article>
  );
}
