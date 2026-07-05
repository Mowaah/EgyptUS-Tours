import Image from "next/image";
import styles from "./page.module.scss";

// TODO: Replace with real API data
const MOCK_INCLUSIONS = [
  "4 Nights Nile Cruise from Luxor to Aswan in Deluxe Cabin",
  "Guided Tours of Karnak Temple, Luxor Temple & Valley",
  "Traditional Felucca Sailing Experience Around Island",
  "24/7 Expert Egyptologist Guide & Air-Conditioned",
  "Visit to Philae Temple, Aswan High Dam & Unfinished Obelisk",
];

const MOCK_EXCLUSIONS = [
  "International & Domestic Flights",
  "Visa Fees & Travel Insurance",
  "Personal Expenses (Laundry, Room Service, Mini Bar)",
  "24/7 Expert Egyptologist Guide & Air-Conditioned Transportation",
  "Gratuities for Guide, Drivers & Cruise Staff",
];

export default function TripInclusionsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/trips/inclusions.svg" alt="" width={20} height={20} />
        </div>
        <h2>Inclusions</h2>
      </div>

      <div className={styles.columnsWrapper}>
        
        {/* Included Column */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Included</h3>
          <div className={styles.listContainer}>
            {MOCK_INCLUSIONS.map((item, index) => (
              <div key={index} className={styles.listItem}>
                <div className={styles.checkIcon}>
                  <Image src="/images/check-blue.svg" alt="Included" width={12} height={12} />
                </div>
                <span className={styles.itemText}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Not Included Column */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Not- Included</h3>
          <div className={styles.listContainer}>
            {MOCK_EXCLUSIONS.map((item, index) => (
              <div key={index} className={styles.listItem}>
                <div className={styles.closeIcon}>
                  <Image src="/images/close-red.svg" alt="Not Included" width={10} height={10} />
                </div>
                <span className={styles.itemText}>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
