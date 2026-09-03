import { HotelCard, Button } from "@/components/shared";
import Image from "next/image";
import { Hotel } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./SimilarHotels.module.scss";

interface SimilarHotelsProps {
  similarHotels: Hotel[];
}

export default function SimilarHotels({ similarHotels }: SimilarHotelsProps) {
  const { t } = useTranslation("hotels");
  return (
    <section id="similar-hotels" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.heading}>{t("similarHotels.heading", "Similar Hotels")}</h2>
        </div>
        <Button
          variant="primary"
          size="md"
          href="/hotels"
          icon={
            <Image
              src="/images/arrows/arrow-right.svg"
              alt=""
              width={24}
              height={24}
            />
          }
        >
          {t("similarHotels.exploreMore", "Explore More")}
        </Button>
      </div>

      <div className={styles.grid}>
        {similarHotels.map((h, i) => (
          <HotelCard key={h.id || i} hotel={h} imageHeight={225} />
        ))}
      </div>
    </section>
  );
}
