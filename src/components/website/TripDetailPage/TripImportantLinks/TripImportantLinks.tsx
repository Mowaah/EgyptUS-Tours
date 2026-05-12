"use client";

import { useState } from "react";
import Image from "next/image";
import { Trip } from "@/types";

import ImportantLinksModal from "./ImportantLinksModal";
import { getPolicyIdFromLink } from "./getPolicyIdFromLink";
import type { PolicyId } from "./policyModalTypes";
import styles from "./TripImportantLinks.module.scss";

interface Props {
  trip: Trip;
}

export default function TripImportantLinks({ trip }: Props) {
  const links = trip.importantLinks ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<PolicyId>("terms");

  if (!links.length) return null;

  const openModal = (link: { label: string; href: string }) => {
    setInitialTab(getPolicyIdFromLink(link));
    setModalOpen(true);
  };

  return (
    <>
      <section id="more-adventures" className={styles.section}>
        <div className={styles.banner}>
          <Image src="/images/caution-yellow.svg" alt="Important" width={20} height={20} />
          <span>Please make sure to review the following links</span>
        </div>

        <h2 className={styles.heading}>Important links</h2>
        <p className={styles.subtitle}>
          They include important information about our policies, privacy terms, payment details, and related guidelines.
        </p>

        <div className={styles.pills}>
          {links.map((link, i) => (
            <button
              key={`${link.href}-${i}`}
              type="button"
              className={styles.pill}
              onClick={() => openModal(link)}
            >
              {link.label}
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

      <ImportantLinksModal open={modalOpen} initialTab={initialTab} onClose={() => setModalOpen(false)} />
    </>
  );
}
