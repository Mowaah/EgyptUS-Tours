"use client";

import Image from "next/image";
import { Hotel } from "@/types";
import Button from "@/components/shared/Button/Button";
import HotelFacilities from "../HotelFacilities/HotelFacilities";
import HotelLocation from "../HotelLocation/HotelLocation";
import styles from "./HotelOverview.module.scss";

interface HotelOverviewProps {
  hotel: Hotel;
}

export default function HotelOverview({ hotel }: HotelOverviewProps) {
  const ov = hotel.overview;

  return (
    <section id="overview" className={styles.section}>
      <div className={styles.layout}>
        {/* ── Left: Content ── */}
        <div className={styles.content}>
          <h2 className={styles.heading}>Overview</h2>

          {ov?.sections.map((section, idx) => (
            <div key={idx} className={styles.overviewSection}>
              <h3 className={styles.label}>{section.heading}</h3>
              <p className={styles.text}>{section.body}</p>
            </div>
          ))}

          {/* Moved from standalone sections in HotelDetailPage to integrate seamlessly */}
          <div className={styles.integratedSection}>
            <HotelFacilities hotel={hotel} />
          </div>
          <div className={styles.integratedSection}>
            <HotelLocation hotel={hotel} />
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.bookCard}>
            <h3 className={styles.bookTitle}>Plan Your Stay</h3>
            <p className={styles.bookSubtitle}>
              Choose your check-in and check-out dates and select the number of rooms.
            </p>
            
            <div className={styles.divider} />

            <div className={styles.priceContainer}>
              <div className={styles.priceRow}>
                <div>
                  <span className={styles.priceLabel}>Start From</span>
                  <span className={styles.priceSub}>Per Night</span>
                </div>
                <span className={styles.priceValue}>
                  ${hotel.pricePerNight?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className={styles.ctas}>
              <Button
                variant="secondary"
                fullWidth
                icon={<Image src="/images/arrows/arrow-right.svg" alt="" width={20} height={20} />}
                iconPosition="right"
              >
                Check Rooms & Dates
              </Button>
            </div>
            
            <p className={styles.cancelPolicy}>
              Free cancellation up to 24 hours before
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
