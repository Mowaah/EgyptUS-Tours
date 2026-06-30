"use client";

import React, { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import HotelsSummaryGrid from "./HotelsSummaryGrid/HotelsSummaryGrid";
import HotelsPanel from "./HotelsPanel/HotelsPanel";
import AddHotelBookingModal from "./AddHotelBookingModal/AddHotelBookingModal";
import styles from "./HotelsBookings.module.scss";

interface HotelsBookingsProps {
  searchQuery?: string;
}

export default function HotelsBookings({ searchQuery = "" }: HotelsBookingsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleNewBooking = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar onPrimaryAction={handleNewBooking} />
      <HotelsSummaryGrid />
      <HotelsPanel searchQuery={searchQuery} />

      <AddHotelBookingModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
