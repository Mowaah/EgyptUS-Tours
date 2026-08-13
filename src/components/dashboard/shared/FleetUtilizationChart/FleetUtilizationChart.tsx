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



export interface FleetUtilizationChartProps {
  title?: string;
  subtitle?: string;
  showBanner?: boolean;
  actions?: React.ReactNode;
  fleetData?: any[];
  mode?: "finance" | "operational";
}

const COLOR_PALETTE = ["#2A74E5", "#FF6600", "#2BAB6F", "#A347D1", "#E53E3E"];

export default function FleetUtilizationChart({
  title = "Fleet Revenue & Bookings",
  subtitle = "Revenue and booking breakdown by vehicle type",
  showBanner = true,
  actions,
  fleetData: rawFleetData,
  mode = "finance",
}: FleetUtilizationChartProps = {}) {
  const [mounted, setMounted] = useState(false);

  let activeFleetData: FleetData[] = [];

  if (Array.isArray(rawFleetData) && rawFleetData.length > 0) {
    if (mode === "finance") {
      const maxRev = Math.max(1, ...rawFleetData.map(f => parseFloat(f.total_revenue || "0")));
      activeFleetData = rawFleetData.map((item, idx) => {
        const rev = parseFloat(item.total_revenue || "0");
        const pct = maxRev > 0 ? Math.round((rev / maxRev) * 100) : 0;
        return {
          id: idx + 1,
          title: item.vehicle_type || "Unspecified",
          subtitle: `${item.booking_count || 0} Bookings ($${item.total_revenue || "0.00"})`,
          utilization: pct,
          color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
        };
      });
    } else if (mode === "operational") {
      activeFleetData = rawFleetData.map((item, idx) => {
        return {
          id: idx + 1,
          title: item.vehicle_type || "Unspecified",
          subtitle: `${item.active_vehicles || 0} / ${item.total_vehicles || 0} Active Vehicles`,
          utilization: parseFloat(item.utilization_pct || "0"),
          color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
        };
      });
    }
  }

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
        title={title}
        subtitle={subtitle}
        actions={actions}
      />

      <div className={styles.rowList}>
        {activeFleetData.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#6B7280", fontSize: "0.9rem" }}>
            No transport data recorded for this period.
          </div>
        ) : (
          activeFleetData.map((item) => (
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
          ))
        )}
      </div>
    </article>
  );
}
