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
  heading = "Ready to Plan Your Next Corporate Event?",
  description = "Our expert team is ready to create a customized proposal for your organization's unique requirements.",
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
