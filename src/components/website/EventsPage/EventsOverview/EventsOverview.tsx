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
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2971E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>Primary Locations</span>
                      <span className={styles.aDesc}>Cairo • Sharm El Sheikh • Luxor • Alexandria</span>
                    </div>
                  </div>

                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2971E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.4 4.4-4.3 4.3-3.4-.6-1.5 1.5 4.8 2.2 2.2 4.8 1.5-1.5-.6-3.4 4.3-4.3 4.4 7.4 3.6-1.2c.5-.2.8-.6.7-1.1z"></path></svg>
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>Airport Access</span>
                      <span className={styles.aDesc}>Cairo International Airport (CAI) - Direct flights from 100+ cities</span>
                    </div>
                  </div>

                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2971E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
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

