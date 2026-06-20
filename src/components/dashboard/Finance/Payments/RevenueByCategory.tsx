import RoundedDonutChart from "@/components/shared/RoundedDonutChart/RoundedDonutChart";
import styles from "./PaymentsPage.module.scss";
import Image from "next/image";

export default function RevenueByCategory() {
  const chartData = [
    { label: "Trips", value: 40, color: "#A1CCFF" },
    { label: "Hotels", value: 20, color: "#FFC6A0" },
    { label: "Transportation", value: 30, color: "#E9BDFF" },
  ];

  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <Image src="/images/dashboard/customers/overview/service.svg" alt="" width={24} height={24} />
        </div>
        <div>
          <h2 className={styles.cardTitle}>Revenue by Category</h2>
          <p className={styles.cardSubtitle}>Distribution of revenue across trips, hotels, and transportation</p>
        </div>
      </div>
      
      <div className={styles.donutWrapper}>
        <RoundedDonutChart 
          data={chartData} 
          centerValue="147K" 
          centerLabel="Total Payments" 
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
