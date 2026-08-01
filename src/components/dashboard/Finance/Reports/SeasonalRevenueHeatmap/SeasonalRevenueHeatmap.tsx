import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import styles from "./SeasonalRevenueHeatmap.module.scss";

type HeatLevel = 1 | 2 | 3;

interface HeatmapRow {
  label: string;
  data: HeatLevel[];
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const defaultHeatmapData: HeatmapRow[] = [
  {
    label: "Trips",
    data: [2, 3, 1, 2, 1, 2, 2, 3, 1, 3, 1, 2],
  },
  {
    label: "Hotels",
    data: [2, 1, 3, 3, 3, 1, 2, 3, 1, 3, 1, 2],
  },
  {
    label: "Transport",
    data: [1, 1, 3, 1, 3, 1, 2, 1, 3, 3, 1, 2],
  },
  {
    label: "MICE",
    data: [3, 2, 1, 1, 2, 1, 2, 1, 3, 1, 1, 2],
  },
];

export interface SeasonalRevenueHeatmapProps {
  heatmapData?: any[];
}

export default function SeasonalRevenueHeatmap({ heatmapData: rawData }: SeasonalRevenueHeatmapProps = {}) {
  const getLevelClass = (level: HeatLevel) => {
    switch (level) {
      case 1: return styles.level1;
      case 2: return styles.level2;
      case 3: return styles.level3;
      default: return styles.level1;
    }
  };

  const getHeatLevel = (val: number): HeatLevel => {
    if (val > 2000) return 3;
    if (val > 500) return 2;
    return 1;
  };

  let rows: HeatmapRow[] = defaultHeatmapData;
  let dynamicMonths = months;

  if (rawData && rawData.length > 0) {
    dynamicMonths = rawData.map((item) => {
      const d = new Date(item.month);
      return isNaN(d.getTime()) ? item.month : d.toLocaleString("default", { month: "short" });
    });

    const categories = [
      { key: "trip", label: "Trips" },
      { key: "hotel", label: "Hotels" },
      { key: "transport", label: "Transport" },
      { key: "custom_trip", label: "MICE" },
    ];

    rows = categories.map((cat) => ({
      label: cat.label,
      data: rawData.map((item) => {
        const num = parseFloat(item[cat.key] || "0");
        return getHeatLevel(num);
      }),
    }));
  }

  return (
    <article className={styles.card}>
      <PanelHeader
        icon="finance/payment/seasonal"
        title="Seasonal Revenue Heatmap"
        subtitle="Revenue distribution across services and months"
      />

      <div className={styles.heatmapContainer}>
        <div className={styles.grid}>
          {rows.map((row, rowIndex) => (
            <div key={row.label} className={styles.row}>
              <div className={styles.rowLabel}>{row.label}</div>
              {row.data.map((level, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  className={`${styles.block} ${getLevelClass(level)}`} 
                />
              ))}
            </div>
          ))}

          {/* X Axis Labels */}
          <div className={styles.monthLabelRow}>
            <div className={styles.rowLabel} />
            {dynamicMonths.map((month, idx) => (
              <div key={`${month}-${idx}`} className={styles.monthLabel}>
                {month}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legendArea}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendLabel}>&lt; $500</span>
              <div className={`${styles.legendColor} ${styles.level1}`} />
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendLabel}>$500 - $2K</span>
              <div className={`${styles.legendColor} ${styles.level2}`} />
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendLabel}>&gt; $2K</span>
              <div className={`${styles.legendColor} ${styles.level3}`} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
