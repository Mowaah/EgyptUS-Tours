"use client";

import Image from "next/image";
import StarRating from "@/components/shared/StarRating/StarRating";
import styles from "./page.module.scss";
import { useTripDetailContext } from "../layout";

interface NamedItem {
  name?: string;
  title?: string;
}

import { getLangKey } from "@/components/dashboard/shared/i18n";

export default function TripOverviewPage() {
  const { trip, loading, activeLang } = useTripDetailContext();

  if (loading || !trip) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  const category = trip.tags && trip.tags.length > 0 ? trip.tags[0].name || trip.tags[0].title : "Unassigned";

  const langKey = getLangKey(activeLang);
  const t = trip?.translations?.[langKey] || {};
  const tEn = trip?.translations?.en || {};
  const title = t.title || tEn.title || trip?.title;
  const rating = trip?.rating_avg ? parseFloat(String(trip.rating_avg)) : 0;

  return (
    <div className={styles.viewLayout}>
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
            <span className={styles.value}>{trip.trip_code || trip.id}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Trip Name</span>
            <span className={styles.value}>{title}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Category</span>
            <span className={styles.value}>{category}</span>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Destinations</span>
            <div className={styles.destinationsList}>
              {trip.destinations && trip.destinations.length > 0 ? trip.destinations.map((d: NamedItem, idx: number) => (
                <div key={idx} className={styles.destinationTag}>
                  <Image src="/images/location-blue-filled.svg" alt="" width={18} height={18} />
                  <span>{d.name || d.title}</span>
                </div>
              )) : (
                <span className={styles.value}>None</span>
              )}
            </div>
          </div>

          <div className={styles.horizontalBorder}>
            <span className={styles.label}>Tour</span>
            <div className={styles.tourTypeTags}>
              {trip.offers_private_tour && (
                <div className={styles.tagPrivate}>
                  <div className={styles.dot} />
                  <span>Private Tour</span>
                </div>
              )}
              {trip.offers_group_tour && (
                <div className={styles.tagGroup}>
                  <div className={styles.dot} />
                  <span>Group Tour</span>
                </div>
              )}
              {!trip.offers_group_tour && !trip.offers_private_tour && (
                <span className={styles.value}>Not specified</span>
              )}
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

          <div className={styles.durationBlock}>
            <span className={styles.label}>Duration</span>
            <div className={styles.durationWrap}>
              <div className={styles.durationTag}>
                <Image src="/images/clock2-blue.svg" alt="" width={18} height={18} />
                <span>{trip.duration_label || `${trip.duration_days || 0} Days`}</span>
              </div>
            </div>
          </div>

          <div className={styles.brochureBlock}>
            <span className={styles.label}>Brochure</span>
            {trip.brochure_url ? (
              <a className={styles.brochureFile} href={trip.brochure_url} target="_blank" rel="noreferrer">
                <Image src="/images/dashboard/file/pdf.svg" alt="PDF" width={40} height={40} />
                <div className={styles.fileContent}>
                  <p className={styles.fileName}>{trip.title} Brochure.pdf</p>
                  <p className={styles.fileStatus}>Open brochure</p>
                </div>
              </a>
            ) : (
              <div className={styles.brochureFile}>
                <Image src="/images/dashboard/file/pdf.svg" alt="PDF" width={40} height={40} />
                <div className={styles.fileContent}>
                  <p className={styles.fileName}>No brochure uploaded</p>
                  <p className={styles.fileStatus}>No file available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
              <p className={styles.specText}>{t.overview?.description || tEn.overview?.description || trip.overview?.description || trip.description || "No description provided."}</p>
            </div>
          </div>

          <div className={styles.specItem}>
            <p className={styles.specLabel}>Cultural Value</p>
            <div className={styles.specBox}>
              <p className={`${styles.specText} ${styles.boldText}`}>{t.overview?.cultural_value || tEn.overview?.cultural_value || trip.overview?.cultural_value || "No cultural value provided."}</p>
            </div>
          </div>

          <div className={styles.specItem}>
            <p className={styles.specLabel}>Who is this trip for?</p>
            <div className={styles.specBox}>
              <p className={`${styles.specText} ${styles.boldText}`}>{t.overview?.who_is_it_for || tEn.overview?.who_is_it_for || trip.overview?.who_is_it_for || "Not specified."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
