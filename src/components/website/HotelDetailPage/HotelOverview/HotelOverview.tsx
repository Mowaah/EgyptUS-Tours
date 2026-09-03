import { Hotel } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import HotelFacilities from "../HotelFacilities/HotelFacilities";
import styles from "./HotelOverview.module.scss";

interface HotelOverviewProps {
  hotel: Hotel;
}

export default function HotelOverview({ hotel }: HotelOverviewProps) {
  const { t } = useTranslation("hotels");

  return (
    <section id="overview" className={styles.section}>
      <h2 className={styles.heading}>{t("overview.heading", "Overview")}</h2>

      <div className={styles.overviewSection}>
        {hotel.description && (
          <div style={{ marginBottom: '32px' }}>
            <h3 className={styles.label}>{t("overview.primeLocation", "Prime Location & Accessibility")}</h3>
            <p className={styles.text} dangerouslySetInnerHTML={{ __html: hotel.description.replace(/\n/g, '<br />') }} />
          </div>
        )}
        {hotel.secondDescription && (
          <div>
            <h3 className={styles.label}>{t("overview.luxuryExperience", "Luxury & Guest Experience")}</h3>
            <p className={styles.text} dangerouslySetInnerHTML={{ __html: hotel.secondDescription.replace(/\n/g, '<br />') }} />
          </div>
        )}
      </div>

      <div className={styles.integratedSection}>
        <HotelFacilities hotel={hotel} />
      </div>
    </section>
  );
}
