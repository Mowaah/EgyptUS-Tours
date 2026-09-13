"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

import ImportantLinksModal from "./ImportantLinksModal";
import { fetchLegalTabs } from "./legalTabs";
import styles from "./TripImportantLinks.module.scss";

export default function TripImportantLinks() {
  const { t, language } = useTranslation("trips");
  const [tabs, setTabs] = useState<Array<{ key: string; label: string }>>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTabKey, setInitialTabKey] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;

    fetchLegalTabs(language)
      .then((legalTabs) => {
        if (cancelled) return;
        setTabs(legalTabs.map(({ key, label }) => ({ key, label })));
      })
      .catch((err) => {
        console.error("Failed to load legal content:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  if (!tabs.length) return null;

  const openModal = (tabKey: string) => {
    setInitialTabKey(tabKey);
    setModalOpen(true);
  };

  return (
    <>
      <section id="more-adventures" className={styles.section}>
        <div className={styles.banner}>
          <Image src="/images/caution-yellow.svg" alt="Important" width={20} height={20} />
          <span>{t("importantLinks.banner", "Please make sure to review the following links")}</span>
        </div>

        <h2 className={styles.heading}>{t("importantLinks.heading", "Important links")}</h2>
        <p className={styles.subtitle}>
          {t("importantLinks.subtitle", "They include important information about our policies, privacy terms, payment details, and related guidelines.")}
        </p>

        <div className={styles.pills}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={styles.pill}
              onClick={() => openModal(tab.key)}
            >
              {tab.label}
              <Image
                src="/images/arrows/arrow-diagonal.svg"
                alt=""
                width={30}
                height={30}
                className={styles.arrowIcon}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </section>

      <ImportantLinksModal
        open={modalOpen}
        initialTabKey={initialTabKey}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
