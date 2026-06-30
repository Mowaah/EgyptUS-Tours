"use client";

import React, { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";

import TransportationSummaryGrid from "./TransportationSummaryGrid/TransportationSummaryGrid";
import TransportationPanel from "./TransportationPanel/TransportationPanel";
import AddTransportationBookingModal from "./AddTransportationBookingModal/AddTransportationBookingModal";
import styles from "./TransportationBookings.module.scss";

interface TransportationBookingsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onNewBooking?: () => void;
}

export default function TransportationBookings({ searchQuery = "", onClearSearch, onNewBooking }: TransportationBookingsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleNewBooking = () => {
    setIsAddModalOpen(true);
    if (onNewBooking) onNewBooking();
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar onPrimaryAction={handleNewBooking} />
      <TransportationSummaryGrid />
      <TransportationPanel
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
        onNewBooking={handleNewBooking}
      />
      <AddTransportationBookingModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
