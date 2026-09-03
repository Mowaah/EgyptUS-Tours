"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader, Button, CustomDatePicker } from "@/components/shared";
import Image from "next/image";
import styles from "./TransportationSection.module.scss";

interface VehicleData {
  id: string;
  name: string;
  passengers: string;
}

interface TransportationSectionProps {
  initialVehicles?: VehicleData[];
}

const getTodayString = () => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

export default function TransportationSection({ initialVehicles = [] }: TransportationSectionProps) {
  const router = useRouter();
  const [vehicles] = useState<VehicleData[]>(initialVehicles);
  const [selected, setSelected] = useState(vehicles[0]?.id || "sedan");
  const [pickupDate, setPickupDate] = useState(getTodayString);

  useEffect(() => {
    setPickupDate(getTodayString());
  }, []);

  const handleSearch = () => {
    // Basic date formatting/passthrough for demo purposes
    router.push(`/transportation?vehicle=${selected}&date=${encodeURIComponent(pickupDate)}`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <SectionHeader
              label="Transportation"
              heading={
                <>
                  Travel Egypt in
                  <br />
                  Comfort
                </>
              }
              description="From private sedans and spacious SUVs to family-friendly vehicles, enjoy comfortable transportation and professional drivers throughout your journey in Egypt."
              align="left"
              headingClassName={styles.largeHeading}
              headingMaxWidth="400px"
            />
            <Button
              variant="outline"
              href="/transportation"
              icon={
                <Image
                  src="/images/arrows/arrow-right-blue.svg"
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
                {vehicles.map((v) => (
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
              <CustomDatePicker value={pickupDate} onChange={setPickupDate} placeholder="Any Date" />

              <Button
                variant="secondary"
                fullWidth
                onClick={handleSearch}
                icon={
                  <Image
                    src="/images/arrows/arrow-right.svg"
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
      </div>

      <div className={styles.mapBleed}>
        <div className={styles.mapStretch}>
          {/* img keeps vector SVG sharp on Safari; CSS background-image rasterizes label boxes */}
          <img
            src="/images/map.svg"
            alt=""
            width={1280}
            height={603}
            className={styles.mapImg}
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
