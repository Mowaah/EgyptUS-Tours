"use client";

import Image from "next/image";
import StarRating from "@/components/shared/StarRating/StarRating";
import styles from "./page.module.scss";

const MOCK_HOTEL = {
  name: "Nile Palace Hotel & Spa",
  subtitle: "Your gateway to Cairo's iconic landmarks.",
  location: "Luxor & Aswan",
  rating: 4.5,
  totalRooms: "250 Room",
  totalReviews: "2300 Review",
  address: "123 Corniche El Nile, Cairo, Egypt",
  description: "Nestled in the heart of Cairo along the iconic Nile Corniche, the Nile Palace Hotel & Spa offers panoramic Nile views and direct access to the city’s vibrant center. Ideally located near the Egyptian Museum, Khan El Khalili, and the Great Pyramids of Giza, guests can easily explore Egypt’s most iconic landmarks.",
  secondDescription: "Blending timeless Egyptian heritage with contemporary five-star comfort, the hotel offers elegant interiors, premium amenities, and exceptional hospitality. Whether traveling for leisure, romance, family vacations, or business, guests enjoy a refined atmosphere designed for relaxation, cultural discovery, and unforgettable Nile-side moments.",
  facilities: [
    "Henna Painting",
    "Restaurant",
    "Luxury Transport",
    "Archaeological Guides",
    "Gym",
    "Private Nile Cruises",
    "WiFi",
    "Cultural Workshops"
  ]
};

export default function HotelOverviewPage() {
  return (
    <div className={styles.viewLayout}>
      {/* Column 1: Basic Information */}
      <div className={styles.leftColumn}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/catalog/hotels/basic.svg" alt="" width={20} height={20} />
          </div>
          <h2>Basic Information</h2>
        </div>

        <div className={styles.infoContainer}>
          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Hotel Name</span>
            <span className={styles.value}>{MOCK_HOTEL.name}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Subtitle</span>
            <span className={styles.value}>{MOCK_HOTEL.subtitle}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>City / Location</span>
            <div className={styles.destinationTag}>
              <Image src="/images/location-blue-filled.svg" alt="" width={18} height={18} />
              <span>{MOCK_HOTEL.location}</span>
            </div>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Star Rating</span>
            <div className={styles.starRatingWrap}>
              <div className={styles.stars}>
                <StarRating filled={MOCK_HOTEL.rating} showValue={false} size={18} />
              </div>
              <span className={styles.ratingText}>( {MOCK_HOTEL.rating} )</span>
            </div>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Total Rooms</span>
            <span className={styles.value}>{MOCK_HOTEL.totalRooms}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Total Reviews</span>
            <span className={styles.value}>{MOCK_HOTEL.totalReviews}</span>
          </div>

          <div className={styles.horizontalBorder} style={{ borderBottom: "none" }}>
            <span className={styles.label}>Address</span>
            <span className={styles.linkValue}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="#FF6600" strokeWidth="1.5"/>
                <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="#FF6600" strokeWidth="1.5"/>
              </svg>
              {MOCK_HOTEL.address}
            </span>
          </div>
        </div>

        <div className={styles.mapContainer}>
          <iframe
            title="Hotel Location Map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(MOCK_HOTEL.name + " " + MOCK_HOTEL.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: "12px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Column 2: Content & Facilities */}
      <div className={styles.rightColumn}>
        <div className={styles.contentCard}>
          <div className={styles.titleRow}>
            <div className={styles.iconWrap}>
              <Image src="/images/dashboard/catalog/hotels/hotel_content.svg" alt="" width={20} height={20} />
            </div>
            <h2>Hotel Content</h2>
          </div>

          <div className={styles.specsContainer}>
            <div className={styles.specItem}>
              <p className={styles.specLabel}>Description</p>
              <div className={styles.specBox}>
                <p className={styles.specText}>{MOCK_HOTEL.description}</p>
              </div>
            </div>

            <div className={styles.specItem}>
              <p className={styles.specLabel}>Second description</p>
              <div className={styles.specBox}>
                <p className={styles.specText}>{MOCK_HOTEL.secondDescription}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.facilitiesCard}>
          <div className={styles.titleRow}>
            <div className={styles.iconWrap}>
              <Image src="/images/dashboard/catalog/hotels/facilities.svg" alt="" width={20} height={20} />
            </div>
            <h2>Facilities</h2>
          </div>

          <div className={styles.facilitiesContainer}>
            {MOCK_HOTEL.facilities.map((facility, index) => (
              <div key={index} className={styles.facilityTag}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#7A7A7A" strokeWidth="1.125"/>
                  <path d="M5.8125 9L7.9375 11.125L12.1875 6.875" stroke="#7A7A7A" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{facility}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
