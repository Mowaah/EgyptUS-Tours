import RoundedDonutChart from "@/components/dashboard/shared/RoundedDonutChart/RoundedDonutChart";
import styles from "../PaymentsPage/PaymentsPage.module.scss";
import Image from "next/image";

interface RevenueByCategoryProps {
  chartData: { label: string; value: number; color: string }[];
  totalValue: string;
}

export default function RevenueByCategory({ chartData, totalValue }: RevenueByCategoryProps) {
  if (!chartData || chartData.length === 0) {
    chartData = [{ label: "No Data", value: 100, color: "#ccc" }];
  }

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
          centerValue={`$${totalValue}`} 
          centerLabel="Total Revenue" 
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
