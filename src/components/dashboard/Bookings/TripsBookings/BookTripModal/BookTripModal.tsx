import React, { useState, useEffect } from "react";
import { ModalHeader } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import Image from "next/image";
import styles from "./BookTripModal.module.scss";

interface BookTripModalProps {
  open: boolean;
  onClose: () => void;
  onBookPrivate?: () => void;
  onBookGroup?: () => void;
}

export default function BookTripModal({ open, onClose, onBookPrivate, onBookGroup }: BookTripModalProps) {
  const [destination, setDestination] = useState("");
  const [tripCategory, setTripCategory] = useState("");
  const [specificTrip, setSpecificTrip] = useState("");

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

  if (!open) return null;

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
              onChange={(e) => setDestination(e.target.value)}
              options={[
                { label: "Select Destination", value: "", disabled: true },
                { label: "Egypt", value: "egypt" },
                { label: "USA", value: "usa" }
              ]}
              variant="modal"
            />
            
            <DashboardField
              control="select"
              label="Trip Category"
              value={tripCategory}
              onChange={(e) => setTripCategory(e.target.value)}
              options={[
                { label: "Select Trip Category", value: "", disabled: true },
                { label: "Cultural", value: "cultural" },
                { label: "Adventure", value: "adventure" }
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
                { label: "Select Trip Category first...", value: "", disabled: true },
                { label: "Pyramids Tour", value: "pyramids" }
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
              <span className={styles.tourPrice}>$2499</span>
            </div>

            <div className={styles.tourCard}>
              <div className={styles.tourInfo}>
                <h3>Group Tour</h3>
                <p>Up to 12 travelers</p>
              </div>
              <span className={styles.tourPrice}>$1299</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnGroup} type="button" onClick={onBookGroup}>
            Book Group Trip
            <Image src="/images/profile2.svg" alt="" width={24} height={24} />
          </button>
          <button className={styles.btnPrivate} type="button" onClick={onBookPrivate}>
            Book Private Trip
            <Image src="/images/profile.svg" alt="" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
