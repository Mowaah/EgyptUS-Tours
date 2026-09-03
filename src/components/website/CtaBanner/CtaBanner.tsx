"use client";

import React from 'react';
import { Button } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./CtaBanner.module.scss";

interface CtaBannerProps {
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  buttonIcon?: React.ReactNode;
}

export default function CtaBanner({
  heading,
  description,
  buttonText,
  buttonHref = "/events/request-proposal",
  buttonIcon,
}: CtaBannerProps) {
  const { t } = useTranslation("home");

  const finalHeading = heading ?? t("ctaBanner.heading", "Ready to Make Your Event Exceptional?");
  const finalDescription = description ?? t("ctaBanner.description", "Tell us what you envision, and our MICE team will create a tailored proposal and handle every detail; from concept to execution.");
  const finalButtonText = buttonText ?? t("ctaBanner.button", "Request a Proposal");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.heading}>{finalHeading}</h2>
          <p className={styles.description}>{finalDescription}</p>
          <Button variant="secondary" href={buttonHref} icon={buttonIcon}>
            {finalButtonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
