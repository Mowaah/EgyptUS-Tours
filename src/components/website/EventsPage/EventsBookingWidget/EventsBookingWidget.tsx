import React from "react";
import Image from "next/image";
import { Button } from "@/components/shared";
import styles from "./EventsBookingWidget.module.scss";

export default function EventsBookingWidget() {
  return (
    <div className={styles.card}>
      <div className={styles.headerContent}>
        <div className={styles.textWrapper}>
          <h3 className={styles.title}>Strategic MICE & Corporate Event Planning</h3>
          <p className={styles.description}>
            Deliver impactful meetings, incentives, conferences, and corporate events with a trusted partner in Egypt
          </p>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.actions}>
        <div className={styles.actionsContent}>
          <Button
            variant="primary"
            size="lg"
            className={styles.primaryBtn}
            icon={<Image src="/images/arrows/arrow-right.svg" alt="" width={24} height={24} style={{ filter: "brightness(0) invert(1)" }} />}
            iconPosition="right"
            href="/events/request-proposal"
          >
            Request Proposal
          </Button>
        </div>
      </div>
    </div>
  );
}
