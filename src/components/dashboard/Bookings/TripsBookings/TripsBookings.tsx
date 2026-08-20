"use client";

import React, { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";

import TripsSummaryGrid from "./TripsSummaryGrid/TripsSummaryGrid";
import TripsPanel from "./TripsPanel/TripsPanel";
import BookTripModal from "./BookTripModal/BookTripModal";
import AddTripBookingModal from "./AddTripBookingModal/AddTripBookingModal";
import styles from "./TripsBookings.module.scss";

interface TripsBookingsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onNewBooking?: () => void;
}

export default function TripsBookings({ searchQuery = "", onClearSearch, onNewBooking }: TripsBookingsProps) {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
  const [selectedTourType, setSelectedTourType] = useState<"private" | "group">("private");
  const [selectedTripId, setSelectedTripId] = useState<string>("");

  const handleNewBooking = () => {
    setIsBookModalOpen(true);
    if (onNewBooking) onNewBooking();
  };

  const handleBookPrivate = (tripId: string) => {
    setSelectedTripId(tripId);
    setSelectedTourType("private");
    setIsBookModalOpen(false);
    setIsAddTripModalOpen(true);
  };

  const handleBookGroup = (tripId: string) => {
    setSelectedTripId(tripId);
    setSelectedTourType("group");
    setIsBookModalOpen(false);
    setIsAddTripModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar onPrimaryAction={handleNewBooking} />
      <TripsSummaryGrid />
      <TripsPanel
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
        onNewBooking={handleNewBooking}
      />
      <BookTripModal
        open={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onBookPrivate={handleBookPrivate}
        onBookGroup={handleBookGroup}
      />
      <AddTripBookingModal
        open={isAddTripModalOpen}
        onClose={() => setIsAddTripModalOpen(false)}
        tourType={selectedTourType}
        tripId={selectedTripId}
      />
    </div>
  );
}
