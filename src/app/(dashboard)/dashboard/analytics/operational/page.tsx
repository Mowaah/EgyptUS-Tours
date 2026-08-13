"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import RevenueByDestinationChart from "@/components/dashboard/shared/RevenueByDestinationChart/RevenueByDestinationChart";
import HotelOccupancyChart from "@/components/dashboard/Analytics/HotelOccupancyChart/HotelOccupancyChart";
import BookingsByServiceChart from "@/components/dashboard/Analytics/BookingsByServiceChart/BookingsByServiceChart";
import FleetUtilizationChart from "@/components/dashboard/shared/FleetUtilizationChart/FleetUtilizationChart";
import ExportButtons from "@/components/shared/ExportButtons/ExportButtons";
import styles from "@/components/dashboard/Analytics/ReportsAnalyticsPage/ReportsAnalyticsPage.module.scss";
import { fetchOperationalReports, downloadReportExport } from "@/services/admin/adminReportsService";

export default function OperationalReportsPage() {
  const searchParams = useSearchParams();
  let range = searchParams.get("range") || "this_month";
  if (range === "30d") range = "last_30";
  if (range === "7d") range = "this_week";

  const { data: reportsData, isLoading } = useSWR(
    ["/admin/reports/operational", range],
    () => fetchOperationalReports({ range }),
    {
      revalidateOnFocus: false,
    }
  );

  const destinationData = useMemo(() => {
    if (!reportsData?.top_destinations) return { chartData: [], maxValue: 1200, gridLabels: ["0", "200", "400", "600", "800", "1000", "1200"] };
    const items = reportsData.top_destinations;
    const totalBookings = items.reduce((sum, item) => sum + item.booking_count, 0) || 1;
    const maxVal = Math.max(10, ...items.map(i => i.booking_count));
    const step = maxVal / 6;

    return {
      chartData: items.map(i => ({
        label: i.destination,
        value: i.booking_count,
        percentage: Math.round((i.booking_count / totalBookings) * 100),
      })).slice(0, 5), // Show top 5
      maxValue: maxVal,
      gridLabels: [
        "0",
        Math.round(step).toString(),
        Math.round(step * 2).toString(),
        Math.round(step * 3).toString(),
        Math.round(step * 4).toString(),
        Math.round(step * 5).toString(),
        Math.round(maxVal).toString(),
      ]
    };
  }, [reportsData]);

  if (isLoading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading reports...</div>;
  }

  return (
    <div className={styles.chartsGrid}>
      <div className={styles.leftColumn}>
        <RevenueByDestinationChart 
          title="Top Destinations in Egypt"
          subtitle="Overview of bookings to different Places"
          icon="reports/top_destinations"
          gridLabels={destinationData.gridLabels}
          tooltipFormat="booking"
          maxValue={destinationData.maxValue}
          data={destinationData.chartData}
          actions={<ExportButtons onCsvClick={() => downloadReportExport("operational", "top_destinations", { range })} />}
        />
        
        <HotelOccupancyChart data={reportsData?.hotel_occupancy || []} actions={<ExportButtons onCsvClick={() => downloadReportExport("operational", "hotel_occupancy", { range })} />} />
      </div>
      
      <div className={styles.rightColumn}>
        <BookingsByServiceChart data={reportsData?.bookings_by_service} actions={<ExportButtons onCsvClick={() => downloadReportExport("operational", "bookings_by_service", { range })} />} />
        
        <FleetUtilizationChart 
          title="Fleet Utilization"
          subtitle="Approximate vehicle utilization %"
          showBanner={false}
          mode="operational"
          fleetData={reportsData?.fleet_utilization || []}
          actions={<ExportButtons onCsvClick={() => downloadReportExport("operational", "fleet_utilization", { range })} />}
        />
      </div>
    </div>
  );
}
