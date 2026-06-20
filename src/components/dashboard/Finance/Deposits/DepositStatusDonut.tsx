import RoundedDonutChart from "@/components/shared/RoundedDonutChart/RoundedDonutChart";
import styles from "./DepositsPage.module.scss";
import Image from "next/image";

export default function DepositStatusDonut() {
  const chartData = [
    { label: "Paid", value: 50, color: "#A1CCFF" },
    { label: "Unpaid", value: 20, color: "#E9BDFF" },
    { label: "Overdue", value: 30, color: "#FFC6A0" },
  ];

  return (
    <div className={styles.chartCard} style={{ paddingBottom: 24 }}>
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
          data={chartData} 
          centerValue="147K" 
          centerLabel="Total Deposits" 
        />
        
        <div className={styles.legend}>
          {chartData.map((item) => (
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
