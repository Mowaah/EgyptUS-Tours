"use client";

import { useState } from "react";
import Image from "next/image";
import { CategoryTabs } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./AboutStory.module.scss";

export default function AboutStory() {
  const { t } = useTranslation("about");
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const tabs = [
    t("story.tabOurStory", "Our Story"),
    t("story.tabVision", "Vision"),
    t("story.tabMission", "Mission"),
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.tabsWrapper}>
          <CategoryTabs 
            className={styles.leftAlignTabs}
            tabs={tabs} 
            active={activeTabIdx} 
            onTabChange={(tab, idx) => setActiveTabIdx(idx)} 
          />
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.textContent}>
            {activeTabIdx === 0 && (
              <>
                <h2 className={styles.mainTitle}>{t("story.mainTitleAbout", "About Us")}</h2>
                <div className={styles.paragraphGroup}>
                  <h3 className={styles.paragraphTitle}>{t("story.storyTitle", "Our Story")}</h3>
                  <div className={styles.paragraphLine}>
                    {t("story.storyP1", "Since 2000, Egypt US Tours has been creating unforgettable journeys across Egypt, growing from a passion for Egypt into a trusted travel partner for travelers and organizations worldwide.")}
                  </div>
                </div>

                <div className={styles.paragraphGroup}>
                  <h3 className={styles.paragraphTitle}>{t("story.coreTitle", "The Core")}</h3>
                  <div className={styles.paragraphLine}>
                    {t("story.coreP1", "Our strength lies in knowing Egypt from the inside out. We combine local expertise with international standards to create personalized journeys, seamless travel arrangements, and exceptional corporate experiences. From private tours and hotel stays to MICE events and on-ground operations, we take care of the details so our clients can focus on enjoying the experience.")}
                  </div>
                </div>
              </>
            )}

            {activeTabIdx === 1 && (
              <>
                <h2 className={styles.mainTitle}>{t("story.visionTitle", "Our Vision")}</h2>
                <div className={styles.paragraphLine}>
                  <p>
                    {t("story.visionP1", "To become a trusted leader in organizing travel experiences inside Egypt and B2B MICE events for companies around the world.")}
                  </p>
                  <p>
                    {t("story.visionP2", "For travelers, Egypt US Tours aims to be the trusted partner that makes discovering Egypt effortless and memorable.")}
                  </p>
                  <p>
                    {t("story.visionP3", "For businesses, the ambition is to become the partner that can take an event in Egypt from concept to execution, allowing the client to focus on their guests, achievement, celebration, or business objectives rather than operational details.")}
                  </p>
                </div>
              </>
            )}

            {activeTabIdx === 2 && (
              <>
                <h2 className={styles.mainTitle}>{t("story.missionTitle", "Our Mission")}</h2>
                <div className={styles.paragraphLine}>
                  <p>
                    {t("story.missionP1", "Egypt US Tours exists to make experiencing Egypt easier, safer, more personalized, and more memorable.")}
                  </p>
                  <p>
                    {t("story.missionP2", "The company takes responsibility for the details so travelers and businesses can focus on enjoying Egypt and creating meaningful memories.")}
                  </p>
                  <p>
                    {t("story.missionP3", "For B2C clients, this means creating fully personalized trips supported by professional guides, team leaders, reservations, transportation, and operational assistance.")}
                  </p>
                  <p>
                    {t("story.missionP4", "For B2B clients, this means providing an end-to-end MICE solution covering the event concept, branding, logistics, hotels, flights, tours, attendee experiences, media coverage, social media, and event operations.")}
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
