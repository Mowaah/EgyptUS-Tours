import React from "react";
import Image from "next/image";
import { Button } from "@/components/shared";
import styles from "./B2BBookingWidget.module.scss";

export default function B2BBookingWidget() {
  return (
    <div className={styles.card}>
      <div className={styles.headerContent}>
        <div className={styles.textWrapper}>
          <h3 className={styles.title}>Your Trusted B2B Corporate Partner</h3>
          <p className={styles.description}>
            Submit your request and our B2B team will prepare a tailored proposal for your company.
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
            href="/b2b-programs/request-proposal"
          >
            Request Proposal
          </Button>
          <Button
            variant="outline"
            size="lg"
            className={styles.secondaryBtn}
            icon={<Image src="/images/calendar-orange2.svg" alt="" width={24} height={24} style={{ filter: "brightness(0) saturate(100%) invert(43%) sepia(91%) saturate(1637%) hue-rotate(2deg) brightness(101%) contrast(106%)" }} />}
            iconPosition="right"
          >
            Schedule Strategy Call
          </Button>
        </div>
      </div>
    </div>
  );
}
