import Image from "next/image";
import styles from "./page.module.scss";

// TODO: Replace with real API data
const DATES_DATA = [
  {
    dateRange: "March 15-19, 2026",
    duration: "5 Days / 4 Nights",
    spotsLeft: "3 Spots left",
    status: "Almost Full!",
    statusColor: "red",
  },
  {
    dateRange: "April 19-23, 2026",
    duration: "5 Days / 4 Nights",
    spotsLeft: "2 Spots left",
    status: "Almost Full!",
    statusColor: "red",
  },
  {
    dateRange: "March 22-26, 2026",
    duration: "5 Days / 4 Nights",
    spotsLeft: "8 Spots left",
    status: "75% Full",
    statusColor: "blue",
    percentage: 75,
  },
  {
    dateRange: "April 5-9, 2026",
    duration: "5 Days / 4 Nights",
    spotsLeft: "12 Spots left",
    status: "45% Full",
    statusColor: "green",
    percentage: 45,
  },
  {
    dateRange: "March 15-19, 2026",
    duration: "5 Days / 4 Nights",
    spotsLeft: "10 Spots left",
    status: "45% Full",
    statusColor: "green",
    percentage: 45,
  },
  {
    dateRange: "April 19-23, 2026",
    duration: "5 Days / 4 Nights",
    spotsLeft: "2 Spots left",
    status: "Almost Full!",
    statusColor: "red",
  },
];

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 6;
  const strokeWidth = 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Path starts at top (8, 2) and draws counter-clockwise (sweep-flag 0) to bottom (8, 14) and back to top
  const circlePath = "M 8 2 A 6 6 0 1 0 8 14 A 6 6 0 1 0 8 2";

  return (
    <svg width="14.33" height="14.33" viewBox="0 0 16 16">
      <path d={circlePath} stroke="currentColor" strokeWidth={strokeWidth} fill="none" opacity="0.2" />
      <path
        d={circlePath}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default function TripDatesPage() {
  return (
    <div className={styles.container}>
      {/* Title Row */}
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/trips/dates.svg" alt="" width={20} height={20} />
        </div>
        <h2>Dates & Availability</h2>
      </div>

      {/* Grid of Dates */}
      <div className={styles.grid}>
        {DATES_DATA.map((item, index) => (
          <div key={index} className={styles.card}>
            {/* Top row */}
            <div className={styles.cardHeader}>
              <span className={styles.dateRange}>{item.dateRange}</span>
              <span className={styles.duration}>{item.duration}</span>
            </div>

            {/* Middle row */}
            <div className={styles.spotsBox}>
              <div className={styles.spotsContent}>
                {/* Minimal SVG icon for users/group */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#6B7280" }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={styles.spotsText}>{item.spotsLeft}</span>
              </div>
            </div>

            {/* Bottom row (status) */}
            <div className={`${styles.statusRow} ${styles[item.statusColor]}`}>
              {item.statusColor === "red" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "#D80027" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              
              {item.statusColor === "blue" && <CircularProgress percentage={item.percentage!} />}
              
              {item.statusColor === "green" && <CircularProgress percentage={item.percentage!} />}
              
              <span>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
