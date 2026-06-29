import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import DoubleBarChart from "@/components/dashboard/shared/DoubleBarChart/DoubleBarChart";

const hotelData = [
  { label: "Grand Hyatt Dubai", value1: 48, value2: 46 },
  { label: "Four Seasons Istanbul", value1: 49, value2: 42 },
  { label: "Marriott Mena House", value1: 49, value2: 42 },
  { label: "Ritz-Carlton Ba", value1: 92, value2: 82 },
  { label: "Le Méridien Maldives", value1: 65, value2: 61 },
];

export default function HotelOccupancyChart() {
  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/hotel_occupancy"
        title="Hotel Occupancy"
        subtitle="Approximate occupancy %"
        actions={<ExportButtons />}
      />
      <DoubleBarChart data={hotelData} />
    </article>
  );
}
