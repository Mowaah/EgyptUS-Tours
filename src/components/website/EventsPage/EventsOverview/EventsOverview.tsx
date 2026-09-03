"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import CategoryTabs from '@/components/shared/CategoryTabs/CategoryTabs';
import styles from './EventsOverview.module.scss';

type TabId = 'overview' | 'features' | 'accessibility';

const EVENT_FEATURES = [
  { title: "Venue Selection", desc: "The right setting for your event" },
  { title: "Event Planning", desc: "From concept to execution" },
  { title: "Hotel & Accommodation", desc: "Comfortable stays for your attendees" },
  { title: "Transportation", desc: "Seamless transfers and logistics" },
  { title: "Event Branding", desc: "Make your event uniquely yours" },
  { title: "Tours & Experiences", desc: "Discover Egypt beyond the event" },
  { title: "Media Coverage", desc: "Capture every important moment" },
  { title: "On-Site Support", desc: "A dedicated team throughout the event" },
];

export default function EventsOverview() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <section id="overview" className={styles.section}>
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
                    Egypt offers a unique MICE destination combining world-class hospitality, diverse venues, competitive value, and thousands of years of history. From executive meetings and conferences to incentive trips, gala dinners, and unique team experiences we can organize it for you.
                  </p>
                </div>

                <div className={styles.stats}>
                  <div className={styles.statCard}>
                    <div className={styles.iconWrap}>
                      <Image src="/images/mice/meetings.svg" alt="" width={32} height={32} />
                    </div>
                    <p className={styles.statValue}>1000</p>
                    <p className={styles.statLabel}>Max capacity</p>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.iconWrap}>
                      <Image src="/images/exhibition.svg" alt="" width={32} height={32} />
                    </div>
                    <p className={styles.statValue}>Open Air or Hotels</p>
                    <p className={styles.statLabel}>Exhibition space</p>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.iconWrap}>
                      <Image src="/images/languages.svg" alt="" width={32} height={32} />
                    </div>
                    <p className={styles.statValue}>10+</p>
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
                      <span className={styles.aTitle}>Multiple Destinations</span>
                      <span className={styles.aDesc}>Cairo • Sharm El Sheikh • Luxor • Alexandria • And More</span>
                    </div>
                  </div>

                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <Image src="/images/airplane-blue.svg" alt="Airport" width={24} height={24} />
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>Easy to Reach</span>
                      <span className={styles.aDesc}>International and domestic flights or by land across Egypt</span>
                    </div>
                  </div>

                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <Image src="/images/calendar-blue.svg" alt="Calendar" width={24} height={24} />
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>Year-Round Events</span>
                      <span className={styles.aDesc}>Plan your corporate experience in Egypt any time of year</span>
                    </div>
                  </div>

                  <div className={styles.accessItem}>
                    <div className={styles.aIconWrap}>
                      <Image src="/images/heads-up.png" alt="Heads up" width={24} height={24} />
                    </div>
                    <div className={styles.aTextWrap}>
                      <span className={styles.aTitle}>Heads up</span>
                      <span className={styles.aDesc}>Let us know 2-3 months prior your event date and flights!</span>
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

