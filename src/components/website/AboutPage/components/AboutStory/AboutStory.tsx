"use client";

import { useState } from "react";
import Image from "next/image";
import { CategoryTabs } from "@/components/shared";
import styles from "./AboutStory.module.scss";

const TABS = ["Our Story", "Vision", "Mission"];

export default function AboutStory() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const activeTab = TABS[activeTabIdx];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.tabsWrapper}>
          <CategoryTabs 
            className={styles.leftAlignTabs}
            tabs={TABS} 
            active={activeTabIdx} 
            onTabChange={(tab, idx) => setActiveTabIdx(idx)} 
          />
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.textContent}>
            {activeTab === "Our Story" && (
              <>
                <h2 className={styles.mainTitle}>About Us</h2>
                <div className={styles.paragraphGroup}>
                  <h3 className={styles.paragraphTitle}>Our Story</h3>
                  <div className={styles.paragraphLine}>
                    In 2000, we started with a simple belief: Egypt&apos;s incredible history, culture, and hospitality deserve to be experienced in extraordinary ways. What began as a small team passionate about sharing Egypt&apos;s wonders has grown into a trusted partner for travelers and corporations worldwide.
                  </div>
                </div>

                <div className={styles.paragraphGroup}>
                  <h3 className={styles.paragraphTitle}>The Core</h3>
                  <div className={styles.paragraphLine}>
                    Over the past 15 years, we&apos;ve organized over 500 successful events, welcomed thousands of guests, and built lasting relationships with hotels, venues, and service providers across Egypt. Our team combines deep local knowledge with international expertise to deliver seamless, memorable experiences.
                  </div>
                </div>
              </>
            )}

            {activeTab === "Vision" && (
              <>
                <h2 className={styles.mainTitle}>Our Vision</h2>
                <div className={styles.paragraphGroup}>
                  <h3 className={styles.paragraphTitle}>We aim to</h3>
                  <div className={styles.paragraphLine}>
                    be the most trusted and innovative travel partner in Egypt, recognized globally for creating transformative experiences that connect people with Egypt&apos;s timeless wonders and modern excellence.
                  </div>
                </div>

                <div className={styles.paragraphGroup}>
                  <h3 className={styles.paragraphTitle}>Beyond Travel</h3>
                  <div className={styles.paragraphLine}>
                    We envision a future where every visitor to Egypt experiences not just ancient monuments, but a profound connection with the culture, people, and modern vibrancy that makes Egypt truly extraordinary. Through innovation and dedication, we aim to set new standards for travel excellence.
                  </div>
                </div>
              </>
            )}

            {activeTab === "Mission" && (
              <>
                <h2 className={styles.mainTitle}>Our Mission</h2>
                <div className={styles.paragraphGroup}>
                  <h3 className={styles.paragraphTitle}>We aim to</h3>
                  <div className={styles.paragraphLine}>
                    To deliver exceptional, personalized travel and event experiences across Egypt through expert planning, genuine hospitality, and unwavering commitment to quality and client satisfaction.
                  </div>
                </div>

                <div className={styles.paragraphGroup}>
                  <h3 className={styles.paragraphTitle}>The Core</h3>
                  <div className={styles.paragraphLine}>
                    We are committed to showcasing the best of Egypt while exceeding expectations at every touchpoint. Our mission is to create lasting memories through meticulous attention to detail, cultural authenticity, and world-class service that honors Egypt&apos;s rich heritage.
                  </div>
                </div>
              </>
            )}

          </div>

          <div className={styles.imageContent}>
            <Image
              src="/images/about-story.jpg"
              alt="Felucca on the Nile"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
