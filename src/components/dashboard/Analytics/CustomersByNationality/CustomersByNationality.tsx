"use client";

import { useState, useMemo } from "react";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import TablePagination from "@/components/dashboard/shared/TablePagination/TablePagination";
import { getNationalityName } from "@/utils/nationality";
import { CustomersByNationality as CustomersByNationalityType } from "@/services/admin/adminReportsService";
import styles from "./CustomersByNationality.module.scss";

const COLORS = ["#8DC1FF", "#FDBA74", "#FFD1DE", "#E9BDFF", "#FDE68A", "#C4B5FD", "#D1D5DB", "#86EFAC"];
const PAGE_SIZE_OPTIONS = [4, 8, 12];

interface CustomersByNationalityProps {
  data?: CustomersByNationalityType[];
  actions?: React.ReactNode;
}

export default function CustomersByNationality({
  data = [],
  actions,
}: CustomersByNationalityProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const totalCustomers = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.customer_count || 0), 0);
  }, [data]);

  // Map full dataset to nationalities, aggregate duplicates, and compute percentages
  const allDistribution = useMemo(() => {
    const countByLabel = new Map<string, number>();

    data.forEach((item) => {
      const label = getNationalityName(item.nationality);
      const current = countByLabel.get(label) || 0;
      countByLabel.set(label, current + (item.customer_count || 0));
    });

    const entries = Array.from(countByLabel.entries()).map(([nationalityLabel, customer_count]) => {
      const pct = totalCustomers > 0 ? Math.round((customer_count / totalCustomers) * 100) : 0;
      return {
        nationality: nationalityLabel,
        nationalityLabel,
        customer_count,
        pct,
      };
    });

    return entries.sort((a, b) => b.customer_count - a.customer_count);
  }, [data, totalCustomers]);

  const maxPercent = useMemo(() => {
    return allDistribution.reduce((max, item) => Math.max(max, item.pct), 0);
  }, [allDistribution]);

  const roundedMax = useMemo(() => {
    return Math.ceil(maxPercent / 20) * 20 || 100;
  }, [maxPercent]);

  const yAxisLabels = useMemo(() => {
    const step = roundedMax / 4;
    return [
      `${roundedMax}%`,
      `${Math.round(roundedMax - step)}%`,
      `${Math.round(roundedMax - step * 2)}%`,
      `${Math.round(roundedMax - step * 3)}%`,
      "0",
    ];
  }, [roundedMax]);

  const pageCount = Math.max(1, Math.ceil(allDistribution.length / pageSize));
  const safePage = Math.min(page, pageCount);

  const pagedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return allDistribution.slice(start, start + pageSize);
  }, [allDistribution, safePage, pageSize]);

  const chartData = useMemo(() => {
    return pagedData.map((item, index) => {
      const globalIndex = (safePage - 1) * pageSize + index;
      return {
        label: item.nationalityLabel,
        value: roundedMax > 0 ? (item.pct / roundedMax) * 100 : 0,
        displayValue: `${item.pct}%`,
        color: COLORS[globalIndex % COLORS.length],
      };
    });
  }, [pagedData, roundedMax, safePage, pageSize]);

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
        icon="reports/customers_by_nationality"
        title="Customers by Nationality"
        actions={actions}
      />

      {data.length === 0 ? (
        <div className={styles.emptyMessage}>
          No nationality data recorded for this period.
        </div>
      ) : (
        <div className={styles.chartWrapper}>
          <HatchedBarChart data={chartData} yAxisLabels={yAxisLabels} />
        </div>
      )}

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
