"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { LegalSection } from "./legalData";
import styles from "./LegalPage.module.scss";

export type LegalPageType = "terms" | "privacy";

interface LegalPageProps {
  data: {
    title?: string;
    subtitle?: string;
    sections: LegalSection[];
  };
  type?: LegalPageType;
}

export default function LegalPage({ data, type = "terms" }: LegalPageProps) {
  const { t } = useTranslation("legal");
  const [activeId, setActiveId] = useState(data.sections[0]?.id);

  const displayTitle =
    data.title ||
    (type === "privacy"
      ? t("privacyTitle", "Privacy and Policy")
      : t("termsTitle", "Terms and conditions"));

  const displaySubtitle =
    data.subtitle ||
    (type === "privacy"
      ? t("privacySubtitle", "Learn how we collect, use, and protect your personal information to ensure your privacy and security.")
      : t("termsSubtitle", "Please read carefully to understand your rights, responsibilities, and the rules of using our services."));

  // Simple scroll spy logic
  useEffect(() => {
    if (!data.sections.length) return;
    const handleScroll = () => {
      const offset = 200; // Account for the sticky navbar and tabs height
      const scrollPos = window.scrollY + offset;

      for (const section of data.sections) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
          setActiveId(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data.sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Account for both the main Navbar (72px/104px) and the sticky tabs (~50px) + some buffer
      const offset = window.innerWidth >= 1150 ? 180 : 140;

      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.decorationWrapper}>
        <Image
          src="/images/dotted-line3.svg"
          alt=""
          width={340}
          height={247}
          className={styles.decoration}
          aria-hidden="true"
        />
      </div>
      <header className={styles.headerSection}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>{displayTitle}</h1>
          <p className={styles.subtitle}>{displaySubtitle}</p>
        </div>
      </header>

      {data.sections.length > 0 && (
        <div className={styles.stickyNav}>
          <div className={styles.navInner}>
            <div className={styles.tabList}>
              {data.sections.map((section) => (
                <button
                  key={section.id}
                  draggable={false}
                  className={`${styles.tabItem} ${activeId === section.id ? styles.activeTab : ""}`}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.title}
                  {activeId === section.id && <div className={styles.activeLine} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.contentSection}>
        <div className={styles.contentInner}>
          {data.sections.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "4rem 0" }}>
              {t("noContent", "No content available at the moment.")}
            </p>
          ) : (
            data.sections.map((section) => (
              <section key={section.id} id={section.id} className={styles.legalBlock}>
                <div className={styles.sectionHeading}>
                  <span className={styles.blueDot} />
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                </div>

                <div
                  className={styles.richTextContent}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
