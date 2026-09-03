import { Hotel } from "@/types";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./HotelFacilities.module.scss";

interface HotelFacilitiesProps {
  hotel: Hotel;
}

export default function HotelFacilities({ hotel }: HotelFacilitiesProps) {
  const facilities = hotel.facilities ?? [];
  const { t } = useTranslation("hotels");

  return (
    <section id="hotel-facilities" className={styles.section}>
      <h2 className={styles.heading}>{t("facilities.heading", "Hotel Facilities")}</h2>
      
      <div className={styles.grid}>
        {facilities.map((fac, idx) => (
          <div key={idx} className={styles.facilityPill}>
            <div className={styles.iconBox}>
              <Image src="/images/star-blue.svg" alt="" width={18} height={18} />
            </div>
            <span className={styles.facilityName}>{fac}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
