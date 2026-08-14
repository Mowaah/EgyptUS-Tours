import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";

import { CustomersByNationality as CustomersByNationalityType } from "@/services/admin/adminReportsService";

const COLORS = ["#8DC1FF", "#FDBA74", "#FFD1DE", "#E9BDFF", "#FDE68A", "#C4B5FD", "#D1D5DB", "#86EFAC"];

export default function CustomersByNationality({
  data,
  actions
}: {
  data?: CustomersByNationalityType[];
  actions?: React.ReactNode;
}) {
  const totalCustomers = data ? data.reduce((sum, item) => sum + item.customer_count, 0) : 0;
  
  const distribution = data 
    ? data.map((item, index) => ({
        label: item.nationality,
        value: totalCustomers > 0 ? (item.customer_count / totalCustomers) * 100 : 0,
        color: COLORS[index % COLORS.length]
      }))
    : [];

  const maxPercent = distribution.reduce((max, item) => Math.max(max, item.value), 0);
  const roundedMax = Math.ceil(maxPercent / 20) * 20 || 100; // Snap to nearest 20%
  const step = roundedMax / 4;
  
  const yAxisLabels = [
    `${roundedMax}%`, 
    `${Math.round(roundedMax - step)}%`, 
    `${Math.round(roundedMax - step * 2)}%`, 
    `${Math.round(roundedMax - step * 3)}%`, 
    "0"
  ];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/customers_by_nationality"
        title="Customers by Nationality"
        actions={actions}
      />
      
      <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
    </article>
  );
}
