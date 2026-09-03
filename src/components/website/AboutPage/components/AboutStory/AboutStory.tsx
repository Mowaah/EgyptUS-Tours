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
                    Since 2000, Egypt US Tours has been creating unforgettable journeys across Egypt, growing from a passion for Egypt into a trusted travel partner for travelers and organizations worldwide.
                  </div>
                </div>

                <div className={styles.paragraphGroup}>
                  <h3 className={styles.paragraphTitle}>The Core</h3>
                  <div className={styles.paragraphLine}>
                    Our strength lies in knowing Egypt from the inside out. We combine local expertise with international standards to create personalized journeys, seamless travel arrangements, and exceptional corporate experiences. From private tours and hotel stays to MICE events and on-ground operations, we take care of the details so our clients can focus on enjoying the experience.
                  </div>
                </div>
              </>
            )}

            {activeTab === "Vision" && (
              <>
                <h2 className={styles.mainTitle}>Our Vision</h2>
                <div className={styles.paragraphLine}>
                  <p>
                    To become a trusted leader in organizing travel experiences inside Egypt and B2B MICE events for companies around the world.
                  </p>
                  <p>
                    For travelers, Egypt US Tours aims to be the trusted partner that makes discovering Egypt effortless and memorable.
                  </p>
                  <p>
                    For businesses, the ambition is to become the partner that can take an event in Egypt from concept to execution, allowing the client to focus on their guests, achievement, celebration, or business objectives rather than operational details.
                  </p>
                </div>
              </>
            )}

            {activeTab === "Mission" && (
              <>
                <h2 className={styles.mainTitle}>Our Mission</h2>
                <div className={styles.paragraphLine}>
                  <p>
                    Egypt US Tours exists to make experiencing Egypt easier, safer, more personalized, and more memorable.
                  </p>
                  <p>
                    The company takes responsibility for the details so travelers and businesses can focus on enjoying Egypt and creating meaningful memories.
                  </p>
                  <p>
                    For B2C clients, this means creating fully personalized trips supported by professional guides, team leaders, reservations, transportation, and operational assistance.
                  </p>
                  <p>
                    For B2B clients, this means providing an end-to-end MICE solution covering the event concept, branding, logistics, hotels, flights, tours, attendee experiences, media coverage, social media, and event operations.
                  </p>
                </div>
              </>
            )}

          </div>

          <div className={styles.imageContent}>
            <Image
              src="/images/about-story.png"
              alt="Pyramids with people on camels"
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
