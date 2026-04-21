"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/shared";
import ChevronIcon from "@public/images/arrows/chevron-blue.svg";
import styles from "./FaqSection.module.scss";

export interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What's included in the trip price?",
    answer:
      "Each trip includes clearly listed services such as accommodation, transportation, guided tours, and selected meals. Full details are available on the trip details page.",
  },
  {
    question: "Can I customize a trip or book a private tour?",
    answer:
      "Yes! You can choose between group or private trips, and customize your itinerary based on your preferences, budget, and travel style.",
  },
  {
    question: "How do I book a trip and confirm availability?",
    answer:
      "Simply select your trip, check available dates, and proceed with booking. A trip manager will contact you to confirm all details after reservation.",
  },
  {
    question: "What is the cancellation or refund policy?",
    answer:
      "Cancellations made 14+ days before departure receive a full refund. Within 14 days, partial refunds apply. Please review the full cancellation policy on the booking confirmation page.",
  },
  {
    question: "Are meals included during the trip?",
    answer:
      "Meal inclusion varies per trip. Most packages include breakfast and selected dinners. The specific meal plan is clearly stated on each trip's detail page.",
  },
];

interface FaqSectionProps {
  items?: FaqItem[];
  description?: string;
  hideHeader?: boolean;
  noPadding?: boolean;
}

export default function FaqSection({
  items = FAQ_ITEMS,
  description = "We've got answers. Find everything you need to know to plan your perfect trip.",
  hideHeader = false,
  noPadding = false
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={`${styles.section} ${noPadding ? styles.noPadding : ""}`}>
      <div className={styles.container}>
        {!hideHeader && (
          <SectionHeader
            label="Frequently Asked Questions"
            heading="Got questions?"
            description={description}
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
                    <ChevronIcon
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
