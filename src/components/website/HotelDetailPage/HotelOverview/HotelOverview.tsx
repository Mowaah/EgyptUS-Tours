import { Hotel } from "@/types";
import HotelFacilities from "../HotelFacilities/HotelFacilities";
import styles from "./HotelOverview.module.scss";

interface HotelOverviewProps {
  hotel: Hotel;
}

export default function HotelOverview({ hotel }: HotelOverviewProps) {
  const ov = hotel.overview;

  return (
    <section id="overview" className={styles.section}>
      <h2 className={styles.heading}>Overview</h2>

      {ov?.sections.map((section, idx) => (
        <div key={idx} className={styles.overviewSection}>
          <h3 className={styles.label}>{section.heading}</h3>
          <p className={styles.text}>{section.body}</p>
        </div>
      ))}

      <div className={styles.integratedSection}>
        <HotelFacilities hotel={hotel} />
      </div>
    </section>
  );
}
