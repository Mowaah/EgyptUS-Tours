"use client";

import React, { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import HotelsSummaryGrid from "./HotelsSummaryGrid/HotelsSummaryGrid";
import HotelsPanel from "./HotelsPanel/HotelsPanel";
import AddHotelBookingModal from "./AddHotelBookingModal/AddHotelBookingModal";
import styles from "./HotelsBookings.module.scss";

interface HotelsBookingsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onNewBooking?: () => void;
}

export default function HotelsBookings({ searchQuery = "", onClearSearch, onNewBooking }: HotelsBookingsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleNewBooking = () => {
    setIsAddModalOpen(true);
    if (onNewBooking) onNewBooking();
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar onPrimaryAction={handleNewBooking} />
      <HotelsSummaryGrid />
      <HotelsPanel 
        searchQuery={searchQuery} 
        onClearSearch={onClearSearch}
        onNewBooking={handleNewBooking}
      />

      <AddHotelBookingModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
