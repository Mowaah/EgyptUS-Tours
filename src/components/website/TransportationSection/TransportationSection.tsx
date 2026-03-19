"use client";

import { useRef, useState } from "react";
import { SectionHeader, Button } from "@/components/shared";
import Image from "next/image";
import styles from "./TransportationSection.module.scss";

const VEHICLES = [
  { id: "sedan", name: "Sedan", passengers: "1-3 passengers" },
  { id: "hiace", name: "Hiace", passengers: "1-10 passengers" },
  { id: "bus", name: "Bus", passengers: "15-30 passengers" },
  { id: "luxury", name: "Luxury Cars", passengers: "1-3 passengers" },
];

export default function TransportationSection() {
  const [selected, setSelected] = useState("sedan");
  const [pickupDate, setPickupDate] = useState("2026-08-29");
  const dateRef = useRef<HTMLInputElement | null>(null);

  const formattedPickup = (() => {
    const d = new Date(pickupDate);
    if (Number.isNaN(d.getTime())) return { main: "Select date", year: "" };

    return {
      main: d.toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }),
      year: d.getFullYear().toString(),
    };
  })();

  const openDatePicker = () => {
    const el = dateRef.current;
    if (!el) return;
    try {
      (el as any).showPicker?.();
    } catch {
    }
    el.focus();
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <SectionHeader
              label="Transportation"
              heading="Choose The Right Fleet For Your Trip"
              description="Choose from Sedans, SUVs, and family-friendly cars. Comfortable rides and professional drivers ready for any trip."
              align="left"
              headingClassName={styles.largeHeading}
              headingMaxWidth="400px"
            />
            <Button
              variant="outline"
              href="/transportation"
              icon={
                <Image
                  src="/images/arrow-right-blue.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              }
            >
              Explore More
            </Button>
          </div>

          <div className={styles.right}>
            <div className={styles.card}>
              <p className={styles.cardLabel}>
                <Image src="/images/car.svg" alt="" width={18} height={18} />
                Select Vehicle
              </p>

              <div className={styles.vehicleGrid}>
                {VEHICLES.map((v) => (
                  <button
                    key={v.id}
                    className={`${styles.vehicleBtn} ${selected === v.id ? styles.vehicleBtnActive : ""}`}
                    onClick={() => setSelected(v.id)}
                    type="button"
                  >
                    <span className={styles.vehicleName}>{v.name}</span>
                    <span className={styles.vehiclePassengers}>{v.passengers}</span>
                  </button>
                ))}
              </div>

              <p className={styles.cardLabel}>
                <Image src="/images/calendar.svg" alt="" width={16} height={16} />
                Pickup Date
              </p>
              <button
                type="button"
                className={styles.pickupDate}
                onClick={openDatePicker}
              >
                <div className={styles.dateValue}>
                  <span className={styles.dateMain}>{formattedPickup.main}</span>
                  {formattedPickup.year ? (
                    <span className={styles.dateYear}>{formattedPickup.year}</span>
                  ) : null}
                </div>
                <input
                  aria-label="Pickup date"
                  type="date"
                  className={styles.dateNative}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  ref={dateRef}
                />
              </button>

              <Button
                variant="secondary"
                fullWidth
                icon={
                  <Image
                    src="/images/arrow-right.svg"
                    alt=""
                    width={24}
                    height={24}
                    style={{ marginTop: "2px" }}
                  />
                }
              >
                Search Vehicle
              </Button>
            </div>
          </div>
        </div>

        <Image
          src="/images/map.svg"
          alt="Map"
          width={500}
          height={600}
          className={styles.mapImage}
          sizes="100vw"
          priority
        />
      </div>
    </section>
  );
}
