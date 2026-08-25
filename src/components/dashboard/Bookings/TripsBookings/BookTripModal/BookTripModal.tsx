import React, { useState, useEffect, useMemo } from "react";
import { ModalHeader } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import Image from "next/image";
import useSWR from "swr";
import { getAllTrips, getTripById } from "@/services/tripsService";
import styles from "./BookTripModal.module.scss";

interface BookTripModalProps {
  open: boolean;
  onClose: () => void;
  onBookPrivate?: (tripId: string) => void;
  onBookGroup?: (tripId: string) => void;
}

export default function BookTripModal({ open, onClose, onBookPrivate, onBookGroup }: BookTripModalProps) {
  const [destination, setDestination] = useState("");
  const [tripCategory, setTripCategory] = useState("");
  const [specificTrip, setSpecificTrip] = useState("");

  const { data: trips, isLoading } = useSWR(open ? "/trips/all" : null, getAllTrips);

  useEffect(() => {
    if (!open) return;
    setDestination("");
    setTripCategory("");
    setSpecificTrip("");

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const destinations = useMemo(() => {
    if (!trips) return [];
    const dests = new Set<string>();
    trips.forEach(t => {
      if (t.location_text) {
        const parts = t.location_text.split(/[·,|-]/);
        parts.forEach(p => {
          const trimmed = p.trim();
          if (trimmed) dests.add(trimmed);
        });
      }
    });
    return Array.from(dests).map(d => ({ label: d, value: d }));
  }, [trips]);

  const filteredTripsByDest = useMemo(() => {
    if (!trips) return [];
    if (!destination) return trips;
    return trips.filter(t => {
      if (!t.location_text) return false;
      return t.location_text.toLowerCase().includes(destination.toLowerCase());
    });
  }, [trips, destination]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    filteredTripsByDest.forEach(t => {
      t.tags?.forEach(tag => cats.add(tag.name));
    });
    return Array.from(cats).map(c => ({ label: c, value: c }));
  }, [filteredTripsByDest]);

  const finalTrips = useMemo(() => {
    if (!tripCategory) return filteredTripsByDest;
    return filteredTripsByDest.filter(t => t.tags?.some(tag => tag.name === tripCategory));
  }, [filteredTripsByDest, tripCategory]);

  const selectedTrip = useMemo(() => {
    return finalTrips.find(t => t.id.toString() === specificTrip);
  }, [finalTrips, specificTrip]);

  const { data: tripDetail } = useSWR(
    specificTrip ? `/trips/${specificTrip}` : null,
    () => getTripById(specificTrip)
  );

  if (!open) return null;

  const privatePrice = tripDetail
    ? tripDetail.private_price
      ? `$${parseFloat(tripDetail.private_price.toString()).toFixed(2)}`
      : tripDetail.base_price
        ? `$${parseFloat(tripDetail.base_price.toString()).toFixed(2)}`
        : "£--"
    : selectedTrip?.base_price 
      ? `$${parseFloat(selectedTrip.base_price.toString()).toFixed(2)}` 
      : "---";

  const groupPrice = tripDetail
    ? tripDetail.group_price
      ? `$${parseFloat(tripDetail.group_price.toString()).toFixed(2)}`
      : "£--"
    : "---";

  const hasGroupOption = !!(tripDetail && tripDetail.group_price);
  const hasPrivateOption = !!(tripDetail && (tripDetail.private_price || tripDetail.base_price));

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Book Customer Trip"
          subtitle="Select whether the customer wants to book a private experience or join a group trip based on their preference."
          iconSrc="/images/dashboard/sidebar/trips.svg"
          onClose={onClose}
        />

        <div className={styles.content}>
          <div className={styles.formFields}>
            <DashboardField
              control="select"
              label="Destination"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setTripCategory("");
                setSpecificTrip("");
              }}
              options={[
                { label: isLoading ? "Loading Destinations..." : "Select Destination", value: "", disabled: true },
                ...destinations
              ]}
              variant="modal"
            />
            
            <DashboardField
              control="select"
              label="Trip Category"
              value={tripCategory}
              onChange={(e) => {
                setTripCategory(e.target.value);
                setSpecificTrip("");
              }}
              disabled={!destination}
              options={[
                { label: "Select Trip Category", value: "", disabled: true },
                ...categories
              ]}
              variant="modal"
            />
            
            <DashboardField
              control="select"
              label="Specific Trip"
              value={specificTrip}
              onChange={(e) => setSpecificTrip(e.target.value)}
              disabled={!tripCategory}
              options={[
                { label: "Select Trip...", value: "", disabled: true },
                ...finalTrips.map(t => ({ label: t.title, value: t.id.toString() }))
              ]}
              variant="modal"
            />
          </div>

          <div className={styles.tourOptions}>
            <div className={styles.tourCard}>
              <div className={styles.tourInfo}>
                <h3>Private Tour</h3>
                <p>Maximum flexibility</p>
              </div>
              <span className={styles.tourPrice}>{selectedTrip ? privatePrice : "---"}</span>
            </div>

            <div className={styles.tourCard}>
              <div className={styles.tourInfo}>
                <h3>Group Tour</h3>
                <p>Up to 12 travelers</p>
              </div>
              <span className={styles.tourPrice}>{selectedTrip ? groupPrice : "---"}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnGroup} type="button" onClick={() => specificTrip && onBookGroup?.(specificTrip)} disabled={!specificTrip || !hasGroupOption}>
            Book Group Trip
            <Image src="/images/profile2.svg" alt="" width={24} height={24} />
          </button>
          <button className={styles.btnPrivate} type="button" onClick={() => specificTrip && onBookPrivate?.(specificTrip)} disabled={!specificTrip || !hasPrivateOption}>
            Book Private Trip
            <Image src="/images/profile.svg" alt="" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
