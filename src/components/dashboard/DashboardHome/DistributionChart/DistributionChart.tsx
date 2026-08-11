import type { DistributionItem } from "../types";
import HatchedBarChart from "@/components/dashboard/shared/HatchedBarChart/HatchedBarChart";

interface DistributionChartProps {
  distribution: DistributionItem[];
  yAxisLabels?: string[];
}

export default function DistributionChart({ distribution, yAxisLabels = ["5k", "4k", "3k", "2k", "1k", "0"] }: DistributionChartProps) {

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: "32px" }}>
      <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
    </div>
  );
}
