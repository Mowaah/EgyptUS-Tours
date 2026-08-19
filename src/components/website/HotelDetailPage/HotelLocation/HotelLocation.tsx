import { Hotel } from "@/types";
import Image from "next/image";
import styles from "./HotelLocation.module.scss";

interface HotelLocationProps {
  hotel: Hotel;
}

export default function HotelLocation({ hotel }: HotelLocationProps) {
  return (
    <section id="location" className={styles.section}>
      <h2 className={styles.heading}>Location</h2>

      <div className={styles.addressBar}>
        <Image src="/images/location-orange.svg" alt="" width={24} height={24} />
        <p className={styles.address}>{hotel.address}</p>
      </div>

      <div className={styles.mapContainer}>
        {hotel.address || hotel.location ? (
          <iframe
            className={styles.mapIframe}
            src={hotel.mapEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(hotel.address || hotel.location || "")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hotel Location Map"
          />
        ) : (
          <div className={styles.mapPlaceholder}>
            <p>Map not available</p>
          </div>
        )}

        {/* Controls Overlay (Static Visuals) */}
        <div className={styles.mapControls}>
          <button className={styles.controlBtn}>
            <Image src="/images/arrows/pagination-arrow.svg" alt="Expand" width={20} height={20} style={{ transform: "rotate(45deg)" }} />
          </button>
          <div className={styles.zoomControls}>
            <button className={styles.controlBtn}>+</button>
            <button className={styles.controlBtn}>-</button>
          </div>
        </div>
      </div>
    </section>
  );
}
