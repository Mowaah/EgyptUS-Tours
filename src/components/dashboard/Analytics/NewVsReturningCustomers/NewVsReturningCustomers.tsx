import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import { LineChart } from "@/components/dashboard/DashboardHome/LineChart";
import { Legend } from "@/components/dashboard/DashboardHome/Legend";
import type { ChartLine } from "@/components/dashboard/DashboardHome/types";
import styles from "./NewVsReturningCustomers.module.scss";

const chartLines: ChartLine[] = [
  {
    name: "New",
    color: "#8DC1FF", // Matching the lighter blue area line
    areaColor: "#8DC1FF",
    points: [200, 250, 360, 450, 330, 180, 170, 260, 90, 60, 300, 380], // Approximate points from mockup
  },
  {
    name: "Returning",
    color: "#FDBA74", // Matching the orange area line
    areaColor: "#FFEDD5",
    points: [60, 100, 200, 230, 270, 430, 290, 100, 80, 230, 260, 290], // Approximate points from mockup
  },
];

export default function NewVsReturningCustomers() {
  return (
    <article className={`${parentStyles.chartCard} ${styles.fullWidthCard}`}>
      <PanelHeader
        icon="reports/profile_grey"
        title="New vs. Returning Customers"
        subtitle="Based on total bookings (≤3 = New)"
        actions={<ExportButtons />}
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
