import RoundedDonutChart from "@/components/dashboard/shared/RoundedDonutChart/RoundedDonutChart";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import parentStyles from "../ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import styles from "./LostLeadsAnalysis.module.scss";

export default function LostLeadsAnalysis({ actions }: { actions?: React.ReactNode }) {
  const chartData = [
    { label: "Price too high", value: 40, color: "#A1CCFF" },
    { label: "Booked competitor", value: 30, color: "#FFC6A0" },
    { label: "No response", value: 20, color: "#FFD6DD" },
    { label: "Date unavailable", value: 10, color: "#E9BDFF" },
    { label: "Other", value: 30, color: "#A1FFAF" },
  ];

  const leftColumnData = [
    { label: "Price too high", value: 40, color: "#A1CCFF" },
    { label: "No response", value: 20, color: "#FFD6DD" },
    { label: "Other", value: 30, color: "#A1FFAF" },
  ];

  const rightColumnData = [
    { label: "Booked competitor", value: 30, color: "#FFC6A0" },
    { label: "Date unavailable", value: 10, color: "#E9BDFF" },
  ];

  return (
    <article className={parentStyles.chartCard}>
      <PanelHeader
        icon="reports/lost_leads"
        title="Lost Leads Analysis"
        subtitle="Reasons for lost leads"
        actions={actions}
      />
      
      <div className={styles.donutWrapper}>
        <RoundedDonutChart 
          data={chartData} 
          centerValue="500" 
          centerLabel="Lost" 
        />
        
        <div className={styles.legendCard}>
          <div className={styles.legendColumn}>
            {leftColumnData.map((item) => (
              <div key={item.label} className={styles.legendItem}>
                <span 
                  className={styles.legendColor} 
                  style={{ backgroundColor: item.color }} 
                  aria-hidden
                />
                <div className={styles.legendText}>
                  <span className={styles.legendValue}>{item.value}%</span>
                  <span className={styles.legendLabel}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.legendColumn}>
            {rightColumnData.map((item) => (
              <div key={item.label} className={styles.legendItem}>
                <span 
                  className={styles.legendColor} 
                  style={{ backgroundColor: item.color }} 
                  aria-hidden
                />
                <div className={styles.legendText}>
                  <span className={styles.legendValue}>{item.value}%</span>
                  <span className={styles.legendLabel}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
