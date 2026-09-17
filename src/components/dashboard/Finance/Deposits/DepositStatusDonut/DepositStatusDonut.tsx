import RoundedDonutChart from "@/components/dashboard/shared/RoundedDonutChart/RoundedDonutChart";
import styles from "../DepositsPage/DepositsPage.module.scss";
import Image from "next/image";

export default function DepositStatusDonut({ chartData }: { chartData?: Record<string, number> }) {
  const pendingCount = chartData?.pending || 0;
  const overdueCount = chartData?.overdue || 0;
  const totalCount = pendingCount + overdueCount;

  const pendingPct = totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0;
  const overduePct = totalCount > 0 ? 100 - pendingPct : 0;

  const mappedData = [
    { label: "Pending", value: pendingPct, color: "#E9BDFF" },
    { label: "Overdue", value: overduePct, color: "#FFC6A0" },
  ];

  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <Image src="/images/dashboard/finance/payment/chart.svg" alt="" width={24} height={24} />
        </div>
        <div>
          <h2 className={styles.cardTitle}>Deposit Status</h2>
          <p className={styles.cardSubtitle}>Overview of deposit payments across all bookings.</p>
        </div>
      </div>
      
      <div className={styles.donutWrapper}>
        <RoundedDonutChart 
          data={mappedData} 
          centerValue={`${totalCount === 1 && !chartData ? 0 : totalCount.toLocaleString("en-US")}`} 
          centerLabel="Total Deposits" 
        />
        
        <div className={styles.legend}>
          {mappedData.map((item) => (
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
  );
}
