"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./FaqSection.module.scss";

export interface FaqItem {
  question: string;
  answer: string;
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

interface FaqSectionProps {
  items?: FaqItem[];
  description?: string;
  hideHeader?: boolean;
  noPadding?: boolean;
}

export default function FaqSection({
  items = [],
  description,
  hideHeader = false,
  noPadding = false
}: FaqSectionProps) {
  const { t } = useTranslation("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) {
    return null;
  }

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={`${styles.section} ${noPadding ? styles.noPadding : ""}`}>
      <div className={styles.container}>
        {!hideHeader && (
          <SectionHeader
            label={t("sectionLabel", "Frequently Asked Questions")}
            heading={t("sectionHeading", "Got questions?")}
            description={description || t("sectionDescription", "We've got answers. Find everything you need to know to plan your perfect trip.")}
            align="center"
            maxWidth="500px"
            size="large"
          />
        )}

        <div className={styles.accordion}>
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`${styles.item} ${isOpen ? styles.open : ""}`}
              >
                <button
                  className={styles.question}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.number}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.questionText}>{item.question}</span>
                  <span className={styles.icon}>
                    <ChevronUpIcon
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className={styles.answer}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
