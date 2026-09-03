"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import CategoryTabs from '@/components/shared/CategoryTabs/CategoryTabs';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './EventsOverview.module.scss';

type TabId = 'overview' | 'features' | 'accessibility';

export default function EventsOverview() {
  const { t } = useTranslation("events");
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const eventFeatures = [
    { title: t("overview.featureVenue", "Venue Selection"), desc: t("overview.featureVenueDesc", "The right setting for your event") },
    { title: t("overview.featurePlanning", "Event Planning"), desc: t("overview.featurePlanningDesc", "From concept to execution") },
    { title: t("overview.featureHotel", "Hotel & Accommodation"), desc: t("overview.featureHotelDesc", "Comfortable stays for your attendees") },
    { title: t("overview.featureTransport", "Transportation"), desc: t("overview.featureTransportDesc", "Seamless transfers and logistics") },
    { title: t("overview.featureBranding", "Event Branding"), desc: t("overview.featureBrandingDesc", "Make your event uniquely yours") },
    { title: t("overview.featureTours", "Tours & Experiences"), desc: t("overview.featureToursDesc", "Discover Egypt beyond the event") },
    { title: t("overview.featureMedia", "Media Coverage"), desc: t("overview.featureMediaDesc", "Capture every important moment") },
    { title: t("overview.featureSupport", "On-Site Support"), desc: t("overview.featureSupportDesc", "A dedicated team throughout the event") },
  ];

  return (
    <section id="overview" className={styles.section}>
      <div className={styles.content}>

          <CategoryTabs
            className={styles.tabsContainer}
            tabs={[
              t("overview.tabOverview", "Overview"),
              t("overview.tabFeatures", "Features"),
              t("overview.tabAccessibility", "Accessibility"),
            ]}
            active={
              activeTab === 'overview' ? 0
                : activeTab === 'features' ? 1
                  : 2
            }
            onTabChange={(tab, index) => {
              if (index === 0) setActiveTab('overview');
              else if (index === 1) setActiveTab('features');
              else if (index === 2) setActiveTab('accessibility');
            }}
          />

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <>
                <h2 className={styles.title}>{t("overview.title", "Overview")}</h2>
                <div className={styles.descriptionWrap}>
                  <p className={styles.description}>
                    {t("overview.description", "Egypt offers a unique MICE destination combining world-class hospitality, diverse venues, competitive value, and thousands of years of history. From executive meetings and conferences to incentive trips, gala dinners, and unique team experiences we can organize it for you.")}
                  </p>
                </div>

                <div className={styles.stats}>
                  <div className={styles.statCard}>
                    <div className={styles.iconWrap}>
                      <Image src="/images/capacity.svg" alt="" width={32} height={32} />
                    </div>
                    <p className={styles.statValue}>{t("overview.statCapacityNumber", "1000")}</p>
                    <p className={styles.statLabel}>{t("overview.statCapacityLabel", "Max capacity")}</p>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.iconWrap}>
                      <Image src="/images/open-air.svg" alt="" width={32} height={32} />
                    </div>
                    <p className={styles.statValue}>{t("overview.statVenueTypes", "Open Air or Hotels")}</p>
                    <p className={styles.statLabel}>{t("overview.statVenueLabel", "Exhibition space")}</p>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.iconWrap}>
                      <Image src="/images/language.svg" alt="" width={32} height={32} />
                    </div>
                    <p className={styles.statValue}>{t("overview.statLanguagesNumber", "10+")}</p>
                    <p className={styles.statLabel}>{t("overview.statLanguagesLabel", "Languages")}</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'features' && (
              <>
                <h2 className={styles.title}>{t("overview.featuresTitle", "Features")}</h2>

                <div className={styles.featuresGrid}>
                  {eventFeatures.map((feature, idx) => (
                    <div key={idx} className={styles.featureItem}>
                      <div className={styles.fIconWrap}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.fIcon}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div className={styles.fText}>
                        <span className={styles.fTitle}>{feature.title}</span>
                        <span className={styles.fDesc}>{feature.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.servicesDivider}></div>

                <h3 className={styles.servicesTitle}>{t("overview.servicesTitle", "Integrated Event Services")}</h3>

                <div className={styles.servicesGrid}>
                  <div className={styles.serviceItem}>
                    <Image src="/images/hotel-orange.svg" alt="" width={32} height={32} />
                    <span className={styles.sTitle}>{t("overview.serviceHotelsTitle", "Hotels")}</span>
                    <span className={styles.sDesc}>{t("overview.serviceHotelsDesc", "4 & 5 star accommodations")}</span>
                  </div>

                  <div className={styles.serviceItem}>
                    <Image src="/images/car-orange.svg" alt="" width={32} height={32} />
                    <span className={styles.sTitle}>{t("overview.serviceTransportTitle", "Transportation")}</span>
                    <span className={styles.sDesc}>{t("overview.serviceTransportDesc", "VIP transfer services")}</span>
                  </div>

                  <div className={styles.serviceItem}>
                    <Image src="/images/cruise.svg" alt="" width={32} height={32} />
                    <span className={styles.sTitle}>{t("overview.serviceExperiencesTitle", "Experiences")}</span>
                    <span className={styles.sDesc}>{t("overview.serviceExperiencesDesc", "Cultural tours & cruises")}</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'accessibility' && (
              <>
                <h2 className={styles.title}>{t("overview.accessTitle", "Location & Accessibility")}</h2>

                <div className={styles.accessList}>
                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <Image src="/images/locations.svg" alt="Location" width={24} height={24} />
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>{t("overview.accessDestinations", "Multiple Destinations")}</span>
                      <span className={styles.aDesc}>{t("overview.accessDestinationsDesc", "Cairo • Sharm El Sheikh • Luxor • Alexandria • And More")}</span>
                    </div>
                  </div>

                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <Image src="/images/airplane-blue.svg" alt="Airport" width={24} height={24} />
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>{t("overview.accessEasy", "Easy to Reach")}</span>
                      <span className={styles.aDesc}>{t("overview.accessEasyDesc", "International and domestic flights or by land across Egypt")}</span>
                    </div>
                  </div>

                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <Image src="/images/calendar-blue.svg" alt="Calendar" width={24} height={24} />
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>{t("overview.accessYearRound", "Year-Round Events")}</span>
                      <span className={styles.aDesc}>{t("overview.accessYearRoundDesc", "Plan your corporate experience in Egypt any time of year")}</span>
                    </div>
                  </div>

                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <Image src="/images/heads-up.png" alt="Heads up" width={24} height={24} />
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>{t("overview.accessHeadsUp", "Heads up")}</span>
                      <span className={styles.aDesc}>{t("overview.accessHeadsUpDesc", "Let us know 2-3 months prior your event date and flights!")}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
      </div>
    </section>
  );
}
