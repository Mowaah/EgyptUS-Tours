import Image from "next/image";
import parentStyles from "./DepositsPage.module.scss";
import HatchedBarChart from "@/components/shared/HatchedBarChart/HatchedBarChart";

export default function OverdueDepositsChart() {
  const distribution = [
    { label: "Trips", value: 32, color: "#A1CCFF" },
    { label: "Hotels", value: 22, color: "#FFC6A0" },
    { label: "Transport", value: 36, color: "#FFD1DE" },
    { label: "MICE", value: 74, color: "#E9BDFF" },
    { label: "B2B", value: 58, color: "#A1F6CC" },
  ];

  const yAxisLabels = ["$2000", "$1500", "$1000", "$500", "$0"];

  return (
    <div className={parentStyles.chartCard}>
      <div className={parentStyles.cardHeader}>
        <div className={parentStyles.iconBox}>
          <Image src="/images/dashboard/customers/overview/service.svg" alt="" width={24} height={24} />
        </div>
        <div>
          <h2 className={parentStyles.cardTitle}>Overdue Deposits by Service</h2>
          <p className={parentStyles.cardSubtitle}>Outstanding payments grouped by service type.</p>
        </div>
      </div>
      
      <div style={{ marginTop: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <HatchedBarChart data={distribution} yAxisLabels={yAxisLabels} />
      </div>
    </div>
  );
}
