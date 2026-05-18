"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LegalSection } from "./legalData";
import styles from "./LegalPage.module.scss";

interface LegalPageProps {
  data: {
    title: string;
    subtitle: string;
    sections: LegalSection[];
  };
}

export default function LegalPage({ data }: LegalPageProps) {
  const [activeId, setActiveId] = useState(data.sections[0]?.id);

  // Simple scroll spy logic
  useEffect(() => {
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
          <h1 className={styles.title}>{data.title}</h1>
          <p className={styles.subtitle}>{data.subtitle}</p>
        </div>
      </header>

      <div className={styles.stickyNav}>
        <div className={styles.navInner}>
          <div className={styles.tabList}>
            {data.sections.map((section) => (
              <button
                key={section.id}
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

      <div className={styles.contentSection}>
        <div className={styles.contentInner}>
          {data.sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.legalBlock}>
              <div className={styles.sectionHeading}>
                <span className={styles.blueDot} />
                <h2 className={styles.sectionTitle}>{section.title}</h2>
              </div>
              
              <div className={styles.paragraphs}>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className={styles.para}>{p}</p>
                ))}
              </div>

              {section.subsections && section.subsections.length > 0 && (
                <div className={styles.subsections}>
                  {section.subsections.map((sub, i) => (
                    <div key={i} className={styles.subBlock}>
                      <h3 className={styles.subTitle}>{sub.title}</h3>
                      <div className={styles.subContent}>
                        <p>{sub.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
