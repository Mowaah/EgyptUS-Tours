import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import { LineChart } from "@/components/dashboard/DashboardHome/LineChart";
import { Legend } from "@/components/dashboard/DashboardHome/Legend";
import type { ChartLine } from "@/components/dashboard/DashboardHome/types";
import styles from "./NewVsReturningCustomers.module.scss";

import { NewVsReturningSeries } from "@/services/admin/adminReportsService";

export default function NewVsReturningCustomers({ 
  data, 
  actions 
}: { 
  data?: { rule: string; series: NewVsReturningSeries[] }; 
  actions?: React.ReactNode; 
}) {
  const chartLines: ChartLine[] = [
    {
      name: "New",
      color: "#8DC1FF",
      areaColor: "#8DC1FF",
      points: data ? data.series.map(s => s.new) : [0],
    },
    {
      name: "Returning",
      color: "#FDBA74",
      areaColor: "#FFEDD5",
      points: data ? data.series.map(s => s.returning) : [0],
    },
  ];
  return (
    <article className={`${parentStyles.chartCard} ${styles.fullWidthCard}`}>
      <PanelHeader
        icon="reports/profile_grey"
        title="New vs. Returning Customers"
        subtitle={data?.rule || "Based on total bookings (≤3 = New)"}
        actions={actions}
      />
      
      <div className={styles.chartWrapper}>
        <LineChart 
          lines={chartLines} 
          area 
        />
      </div>
      
      <Legend items={chartLines} />
    </article>
  );
}
