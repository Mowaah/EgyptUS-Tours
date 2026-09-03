import React from 'react';
import { Button } from "@/components/shared";
import styles from "./CtaBanner.module.scss";

interface CtaBannerProps {
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  buttonIcon?: React.ReactNode;
}

export default function CtaBanner({
  heading = "Ready to Make Your Event Exceptional?",
  description = "Tell us what you envision, and our MICE team will create a tailored proposal and handle every detail; from concept to execution.",
  buttonText = "Request a Proposal",
  buttonHref = "/events/request-proposal",
  buttonIcon,
}: CtaBannerProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.description}>{description}</p>
          <Button variant="secondary" href={buttonHref} icon={buttonIcon}>
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
