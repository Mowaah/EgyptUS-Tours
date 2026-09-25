import { Hotel } from "@/types";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./HotelLocation.module.scss";

interface HotelLocationProps {
  hotel: Hotel;
}

export default function HotelLocation({ hotel }: HotelLocationProps) {
  const { t } = useTranslation("hotels");

  const displayAddress = hotel.address || hotel.location || "";

  return (
    <section id="location" className={styles.section}>
      <h2 className={styles.heading}>{t("location.heading", "Location")}</h2>

      {displayAddress && (
        <div className={styles.addressBar}>
          <Image src="/images/location-orange.svg" alt="" width={24} height={24} />
          <p className={styles.address} title={displayAddress}>
            {displayAddress}
          </p>
        </div>
      )}

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
            <p>{t("location.mapNotAvailable", "Map not available")}</p>
          </div>
        )}

        {/* Controls Overlay (Static Visuals) */}
        <div className={styles.mapControls}>
          <button type="button" className={`${styles.controlBtn} ${styles.expandBtn}`} aria-label="Expand map">
            <Image src="/images/arrows/pagination-arrow.svg" alt="" width={20} height={20} />
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
