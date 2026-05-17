"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import EventsBookingWidget from '../EventsBookingWidget/EventsBookingWidget';
import CategoryTabs from '@/components/shared/CategoryTabs/CategoryTabs';
import styles from './EventsOverview.module.scss';

type TabId = 'overview' | 'features' | 'accessibility';

const EVENT_FEATURES = [
  { title: "Free WiFi", desc: "High-speed internet for all attendees" },
  { title: "Complimentary Refreshments", desc: "Coffee, tea, and snacks provided" },
  { title: "Climate Control", desc: "Advanced HVAC systems" },
  { title: "Premium Audio", desc: "Professional sound systems" },
  { title: "LED Displays", desc: "4K video walls and screens" },
  { title: "Simultaneous Translation", desc: "12+ languages available" },
  { title: "24/7 Security", desc: "Professional security staff" },
  { title: "Valet Parking", desc: "Complimentary parking service" },
];

export default function EventsOverview() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <section id="overview" className={styles.section}>
      <div className={styles.layout}>
        {/* ── Left: Content ── */}
        <div className={styles.content}>

          <CategoryTabs
            className={styles.tabsContainer}
            tabs={['Overview', 'Features', 'Accessibility']}
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
                <h2 className={styles.title}>Overview</h2>
                <div className={styles.descriptionWrap}>
                  <p className={styles.description}>
                    Egypt is an ideal destination for MICE events, offering a unique combination of strategic location,
                    competitive pricing, and rich cultural experiences. As a gateway between Africa, Asia, and
                    Europe, Egypt provides excellent international connectivity and world-class conference facilities.
                  </p>
                  <p className={styles.description}>
                    Our professional event management teams ensure seamless execution from concept to
                    completion, while the country's iconic historical backdrop creates memorable experiences for
                    delegates. With USD-friendly pricing and luxury 5-star accommodations, Egypt delivers outstanding
                    value for international corporate events.
                  </p>
                </div>

                <div className={styles.stats}>
                  <div className={styles.statCard}>
                    <div className={styles.iconWrap}>
                      <Image src="/images/mice/meetings.svg" alt="" width={32} height={32} />
                    </div>
                    <p className={styles.statValue}>2,500</p>
                    <p className={styles.statLabel}>Max capacity</p>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.iconWrap}>
                      <Image src="/images/exhibition.svg" alt="" width={32} height={32} />
                    </div>
                    <p className={styles.statValue}>5,000m²</p>
                    <p className={styles.statLabel}>Exhibition space</p>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.iconWrap}>
                      <Image src="/images/languages.svg" alt="" width={32} height={32} />
                    </div>
                    <p className={styles.statValue}>12+</p>
                    <p className={styles.statLabel}>Languages</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'features' && (
              <>
                <h2 className={styles.title}>Features</h2>

                <div className={styles.featuresGrid}>
                  {EVENT_FEATURES.map((feature, idx) => (
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

                <h3 className={styles.servicesTitle}>Integrated Event Services</h3>

                <div className={styles.servicesGrid}>
                  <div className={styles.serviceItem}>
                    <Image src="/images/hotel-orange.svg" alt="" width={32} height={32} />
                    <span className={styles.sTitle}>Hotels</span>
                    <span className={styles.sDesc}>4 & 5 star accommodations</span>
                  </div>

                  <div className={styles.serviceItem}>
                    <Image src="/images/car-orange.svg" alt="" width={32} height={32} />
                    <span className={styles.sTitle}>Transportation</span>
                    <span className={styles.sDesc}>VIP transfer services</span>
                  </div>

                  <div className={styles.serviceItem}>
                    <Image src="/images/cruise.svg" alt="" width={32} height={32} />
                    <span className={styles.sTitle}>Experiences</span>
                    <span className={styles.sDesc}>Cultural tours & cruises</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'accessibility' && (
              <>
                <h2 className={styles.title}>Location & Accessibility</h2>

                <div className={styles.accessList}>
                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <Image src="/images/locations.svg" alt="Location" width={24} height={24} />
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>Primary Locations</span>
                      <span className={styles.aDesc}>Cairo • Sharm El Sheikh • Luxor • Alexandria</span>
                    </div>
                  </div>

                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <Image src="/images/airplane-blue.svg" alt="Airport" width={24} height={24} />
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>Airport Access</span>
                      <span className={styles.aDesc}>Cairo International Airport (CAI) - Direct flights from 100+ cities</span>
                    </div>
                  </div>

                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <Image src="/images/calendar-blue.svg" alt="Calendar" width={24} height={24} />
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>Available Dates</span>
                      <span className={styles.aDesc}>Year-round availability • Peak season: October to April</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <aside className={styles.sidebar}>
          <EventsBookingWidget />
        </aside>
      </div>
    </section>
  );
}

