"use client";

import Image from "next/image";
import StarRating from "@/components/shared/StarRating/StarRating";
import { getLangKey } from "@/components/dashboard/shared/i18n";
import { useHotelDetailContext } from "../layout";
import styles from "./page.module.scss";

export default function HotelOverviewPage() {
  const { hotel, loading, activeLang } = useHotelDetailContext();

  if (loading) {
    return <div className={styles.viewLayout}>Loading overview...</div>;
  }

  const langKey = getLangKey(activeLang);
  const translations = hotel?.translations?.[langKey] || {};
  const enTranslations = hotel?.translations?.en || {};
  const hotelName = translations.name || enTranslations.name || hotel?.name || "-";
  const subtitle = translations.subtitle || enTranslations.subtitle || hotel?.subtitle || "-";
  const locationName = hotel?.location?.name || hotel?.location_text || "-";
  const rating = hotel?.stars ? parseFloat(String(hotel.stars)) : 0;
  const totalRooms = hotel?.total_rooms ? `${hotel.total_rooms} Rooms` : "-";
  const totalReviews = hotel?.total_reviews ? `${hotel.total_reviews} Reviews` : "0 Reviews";
  const address = hotel?.address || hotel?.location?.address || "-";

  const description = translations.description || enTranslations.description || hotel?.description || "-";
  const secondDescription = translations.second_description || enTranslations.second_description || hotel?.second_description || "";
  const facilities: string[] = Array.isArray(translations.facilities) 
    ? translations.facilities 
    : Array.isArray(enTranslations.facilities) 
      ? enTranslations.facilities 
      : Array.isArray(hotel?.facilities) 
        ? hotel.facilities 
        : [];

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
            <span className={styles.value}>{hotelName}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Subtitle</span>
            <span className={styles.value}>{subtitle}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>City / Location</span>
            <div className={styles.destinationTag}>
              <Image src="/images/location-blue-filled.svg" alt="" width={18} height={18} />
              <span>{locationName}</span>
            </div>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Star Rating</span>
            <div className={styles.starRatingWrap}>
              <div className={styles.stars}>
                <StarRating filled={rating} showValue={false} size={18} />
              </div>
              <span className={styles.ratingText}>( {rating} )</span>
            </div>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Total Rooms</span>
            <span className={styles.value}>{totalRooms}</span>
          </div>


          {address && address !== "-" && (
            <div className={styles.horizontalBorder} style={{ borderBottom: "none" }}>
              <span className={styles.label}>Address</span>
              <span className={styles.linkValue}>
                <a 
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(address)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00000', textDecoration: 'none' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="#FF6600" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="#FF6600" strokeWidth="1.5"/>
                  </svg>
                  View on Google Maps
                </a>
              </span>
            </div>
          )}
        </div>

        {address && address !== "-" && (
          <div className={styles.mapContainer}>
            <iframe
              title="Hotel Location Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
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
                <p className={styles.specText}>{description}</p>
              </div>
            </div>

            {secondDescription && (
              <div className={styles.specItem}>
                <p className={styles.specLabel}>Second description</p>
                <div className={styles.specBox}>
                  <p className={styles.specText}>{secondDescription}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {facilities.length > 0 && (
          <div className={styles.facilitiesCard}>
            <div className={styles.titleRow}>
              <div className={styles.iconWrap}>
                <Image src="/images/dashboard/catalog/hotels/facilities.svg" alt="" width={20} height={20} />
              </div>
              <h2>Facilities</h2>
            </div>

            <div className={styles.facilitiesContainer}>
              {facilities.map((facility, index) => (
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
        )}
      </div>
    </div>
  );
}
