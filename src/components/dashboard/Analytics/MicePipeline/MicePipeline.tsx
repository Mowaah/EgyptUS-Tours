"use client";

import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import RoundedDonutChart from "@/components/shared/RoundedDonutChart/RoundedDonutChart";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import styles from "./MicePipeline.module.scss";

export default function MicePipeline() {
  const donutData = [
    { label: "RFPs Received", value: 60, color: "#8DC1FF" }, // Blue
    { label: "Proposals Sent", value: 30, color: "#FDBA74" }, // Orange
    { label: "Contracts Signed", value: 10, color: "#FFD1DE" }, // Pink
  ];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="finance/payment/chart"
        title="MICE Pipeline"
        subtitle="RFPs Received → Proposals Sent → Contracts Signed"
        actions={<ExportButtons />}
      />

      <div className={styles.content}>
        <div className={styles.donutWrapper}>
          <RoundedDonutChart
            data={donutData}
            centerValue="500"
            size={600}
          />
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.heading}>
              <div className={styles.company}>RFPs Received</div>
              <div className={styles.percentage}>60%</div>
            </div>
            <div className={styles.line}>
              <div className={styles.indicator} style={{ width: "60%", background: "#A1CCFF" }} />
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.heading}>
              <div className={styles.company}>Proposals Sent</div>
              <div className={styles.percentage}>30%</div>
            </div>
            <div className={styles.line}>
              <div className={styles.indicator} style={{ width: "30%", background: "#FFC6A0" }} />
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.heading}>
              <div className={styles.company}>Contracts Signed</div>
              <div className={styles.percentage}>10%</div>
            </div>
            <div className={styles.line}>
              <div className={styles.indicator} style={{ width: "10%", background: "#FFD6DD" }} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
