import Image from "next/image";
import styles from "./page.module.scss";

// TODO: Replace with real API data
const PRICING_DATA = [
  {
    type: "Private Tour",
    subtitle: "Maximum flexibility",
    basePrice: "$2499",
    seasons: [
      {
        name: "May - Sep",
        prices: [
          { type: "Single Room", price: "2575$" },
          { type: "Double Room", price: "1205$" },
          { type: "Triple Room", price: "1169$" },
        ],
      },
      {
        name: "Oct - Apr",
        prices: [
          { type: "Single Room", price: "2575$" },
          { type: "Double Room", price: "1205$" },
          { type: "Triple Room", price: "1169$" },
        ],
      },
      {
        name: "Christmas & New Year",
        prices: [
          { type: "Single Room", price: "2575$" },
          { type: "Double Room", price: "1205$" },
          { type: "Triple Room", price: "1169$" },
        ],
      },
    ],
  },
  {
    type: "Group Tour",
    subtitle: "Up to 12 travelers",
    basePrice: "$1299",
    seasons: [
      {
        name: "May - Sep",
        prices: [
          { type: "Single Room", price: "2575$" },
          { type: "Double Room", price: "1205$" },
          { type: "Triple Room", price: "1169$" },
        ],
      },
      {
        name: "Oct - Apr",
        prices: [
          { type: "Single Room", price: "2575$" },
          { type: "Double Room", price: "1205$" },
          { type: "Triple Room", price: "1169$" },
        ],
      },
      {
        name: "Christmas & New Year",
        prices: [
          { type: "Single Room", price: "2575$" },
          { type: "Double Room", price: "1205$" },
          { type: "Triple Room", price: "1169$" },
        ],
      },
    ],
  },
];

export default function TripPricingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="" width={20} height={20} />
        </div>
        <h2>Pricing</h2>
      </div>

      {PRICING_DATA.map((tour, index) => (
        <div key={index} className={styles.tourSection}>
          
          {/* Header */}
          <div className={styles.sectionHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.tourTitle}>{tour.type}</span>
              <span className={styles.tourSubtitle}>{tour.subtitle}</span>
            </div>
            <div className={styles.headerPrice}>{tour.basePrice}</div>
          </div>

          {/* Seasons Row */}
          <div className={styles.seasonsWrapper}>
            {tour.seasons.map((season, sIdx) => (
              <div key={sIdx} className={styles.seasonColumn}>
                <span className={styles.seasonTitle}>{season.name}</span>
                
                {season.prices.map((priceItem, pIdx) => (
                  <div key={pIdx} className={styles.priceRow}>
                    <div className={styles.roomInfo}>
                      <span className={styles.perPerson}>Per Person</span>
                      <span className={styles.roomType}>{priceItem.type}</span>
                    </div>
                    <div className={styles.priceValue}>{priceItem.price}</div>
                  </div>
                ))}
                
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}
