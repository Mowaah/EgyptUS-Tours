"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionHeader, Button, CustomDatePicker } from "@/components/shared";
import Image from "next/image";
import styles from "./TransportationSection.module.scss";

const VEHICLES = [
  { id: "sedan", name: "Sedan", passengers: "1-3 passengers" },
  { id: "hiace", name: "Hiace", passengers: "1-10 passengers" },
  { id: "bus", name: "Bus", passengers: "15-30 passengers" },
  { id: "luxury", name: "Luxury Cars", passengers: "1-3 passengers" },
];

export default function TransportationSection() {
  const router = useRouter();
  const [selected, setSelected] = useState("sedan");
  const [pickupDate, setPickupDate] = useState("08/29/2026");

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
              <CustomDatePicker value={pickupDate} onChange={setPickupDate} />

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
          {/* Plain img: SVG stays vector. next/Image often rasterizes for srcset → soft/pixelated on 3× iPhones */}
          <img src="/images/map.svg" alt="Map" className={styles.mapImage} loading="eager" fetchPriority="high" />
        </div>
      </div>
    </section>
  );
}
