import Image from "next/image";
import styles from "./page.module.scss";

// TODO: replace with real API call using params.id
const MOCK_TRIP = {
  id: "BK-TR01",
  name: "Santorini Island Explorer",
  category: "Multi Country Tours",
  destinations: ["Luxor & Aswan"],
  tourTypes: ["Private Tour", "Group Tour"],
  durations: ["4 days - 3 nights", "5 days - 4 nights", "6 days - 5 nights", "7 days - 6 nights"],
  brochure: {
    fileName: "Santorini Island Explorer",
    status: "Uploaded successfully",
  },
  description:
    "Embark on an unforgettable journey through ancient Egypt along the legendary Nile River. Experience the magic of Luxor and Aswan with visits to magnificent temples, royal tombs, and timeless monuments. Sail aboard a luxury Nile cruise while exploring Karnak Temple, Valley of the Kings, Philae Temple, and the colossal Abu Simbel.",
  culturalValue:
    "Connect with 5,000 years of pharaonic history and ancient Egyptian civilization. Experience authentic Nubian culture, learn about hieroglyphics and ancient construction techniques, and participate in traditional felucca sailing. This journey offers insight into one of the world's oldest and most influential civilizations",
  whoIsThisFor:
    "History enthusiasts, couples seeking romantic getaways, and culture lovers looking for an authentic Egyptian experience. Ideal for those who want to explore ancient wonders, learn about pharaonic dynasties, and experience the timeless beauty of the Nile River in comfort and luxury.",
};

export default function TripOverviewPage() {
  return (
    <div className={styles.viewLayout}>

      {/* Column 1: Basic Information */}
      <div className={styles.tripInfoColumn}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/sidebar/trips.svg" alt="" width={20} height={20} />
          </div>
          <h2>Basic Information</h2>
        </div>

        <div className={styles.infoContainer}>
          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Trip ID</span>
            <span className={styles.value}>{MOCK_TRIP.id}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Trip Name</span>
            <span className={styles.value}>{MOCK_TRIP.name}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Category</span>
            <span className={styles.value}>{MOCK_TRIP.category}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Destinations</span>
            <div className={styles.destinationTag}>
              <Image src="/images/location-blue-filled.svg" alt="" width={18} height={18} />
              <span>{MOCK_TRIP.destinations[0]}</span>
            </div>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Tour</span>
            <div className={styles.tourTypeTags}>
              <div className={styles.tagPrivate}>
                <div className={styles.dot} />
                <span>Private Tour</span>
              </div>
              <div className={styles.tagGroup}>
                <div className={styles.dot} />
                <span>Group Tour</span>
              </div>
            </div>
          </div>

          <div className={styles.durationBlock}>
            <span className={styles.label}>Duration</span>
            <div className={styles.durationWrap}>
              {MOCK_TRIP.durations.map((dur, i) => (
                <div key={i} className={styles.durationTag}>
                  <Image src="/images/clock2-blue.svg" alt="" width={18} height={18} />
                  <span>{dur}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.brochureBlock}>
            <span className={styles.label}>Brochure</span>
            <div className={styles.brochureFile}>
              <Image src="/images/dashboard/file/pdf.svg" alt="PDF" width={40} height={40} />
              <div className={styles.fileContent}>
                <p className={styles.fileName}>{MOCK_TRIP.brochure.fileName}</p>
                <p className={styles.fileStatus}>200 KB of 200 KB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Trip Content */}
      <div className={styles.tripSpecsColumn}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/booking/trips/view/price.svg" alt="" width={20} height={20} />
          </div>
          <h2>Trip Content</h2>
        </div>

        <div className={styles.specsContainer}>
          <div className={styles.specItem}>
            <p className={styles.specLabel}>Description</p>
            <div className={styles.specBox}>
              <p className={styles.specText}>{MOCK_TRIP.description}</p>
            </div>
          </div>

          <div className={styles.specItem}>
            <p className={styles.specLabel}>Cultural Value</p>
            <div className={styles.specBox}>
              <p className={`${styles.specText} ${styles.boldText}`}>{MOCK_TRIP.culturalValue}</p>
            </div>
          </div>

          <div className={styles.specItem}>
            <p className={styles.specLabel}>Who is this trip for?</p>
            <div className={styles.specBox}>
              <p className={`${styles.specText} ${styles.boldText}`}>{MOCK_TRIP.whoIsThisFor}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
