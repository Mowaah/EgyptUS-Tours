import { distribution } from "../dashboardHomeData";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";

export default function DistributionChart() {
  const yAxisLabels = ["5k", "4k", "3k", "2k", "1k", "0"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: "32px" }}>
      <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
    </div>
  );
}
