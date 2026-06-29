"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";

import TripsSummaryGrid from "./TripsSummaryGrid/TripsSummaryGrid";
import TripsPanel from "./TripsPanel/TripsPanel";
import styles from "./TripsBookings.module.scss";

interface TripsBookingsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onNewBooking?: () => void;
}

export default function TripsBookings({ searchQuery = "", onClearSearch, onNewBooking }: TripsBookingsProps) {
  return (
    <div className={styles.page}>
      <DashboardNavbar />
      <TripsSummaryGrid />
      <TripsPanel
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
        onNewBooking={onNewBooking}
      />
    </div>
  );
}
