"use client";

import { useEffect, useState } from "react";
import PanelHeader from "@/components/dashboard/DashboardHome/PanelHeader/PanelHeader";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber/AnimatedNumber";
import styles from "./FleetUtilizationChart.module.scss";

interface FleetData {
  id: number;
  title: string;
  subtitle: string;
  utilization: number;
  color: string;
}

const fleetData: FleetData[] = [
  {
    id: 1,
    title: "Sedans",
    subtitle: "20/24 active",
    utilization: 82,
    color: "#2A74E5", // Blue
  },
  {
    id: 2,
    title: "SUVs & Luxury",
    subtitle: "11/12 active",
    utilization: 91,
    color: "#FF6600", // Orange
  },
  {
    id: 3,
    title: "Vans & Hiace",
    subtitle: "12/18 active",
    utilization: 68,
    color: "#2BAB6F", // Green
  },
  {
    id: 4,
    title: "Buses",
    subtitle: "20/24 active",
    utilization: 55,
    color: "#A347D1", // Purple
  },
];

export default function FleetUtilizationChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  return (
    <article className={styles.card}>
      <PanelHeader
        icon="finance/payment/fleet"
        title="Fleet Utilization & Revenue"
        subtitle="SUVs at 91% utilization — consider expanding luxury fleet"
      />

      <div className={styles.rowList}>
        {fleetData.map((item) => (
          <div key={item.id} className={styles.rowCard}>
            <div className={styles.leftSection}>
              <div className={styles.badge}>{item.id}</div>
              
              <div className={styles.info}>
                <div className={styles.titleRow}>
                    <span className={styles.title}>{item.title}</span>
                    <span className={styles.subtitle}>{item.subtitle}</span>
                  </div>
                  
                <div className={styles.progressTrack}>
                  <div 
                    className={styles.progressFill}
                    style={{ 
                      width: mounted ? `${item.utilization}%` : "0%",
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.rightSection}>
              <div className={styles.pill}>
                {mounted ? (
                  <AnimatedNumber value={item.utilization} isActive={true} />
                ) : (
                  0
                )}
                % utilization
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.alertBanner}>
        Buses have lowest utilization (55%). Consider partnering with MICE clients for group transport bundles.
      </div>
    </article>
  );
}
