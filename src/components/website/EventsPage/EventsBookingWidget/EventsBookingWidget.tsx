import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shared";
import styles from "./EventsBookingWidget.module.scss";

const PROPOSAL_HREF = "/events/request-proposal";

export default function EventsBookingWidget() {
  return (
    <aside className={styles.sidebar} aria-label="Request an events proposal">
      <div className={styles.card}>
        <div className={styles.desktop}>
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
                icon={
                  <Image
                    src="/images/arrows/arrow-right.svg"
                    alt=""
                    width={24}
                    height={24}
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                }
                iconPosition="right"
                href={PROPOSAL_HREF}
              >
                Request Proposal
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.mobile}>
          <Link href={PROPOSAL_HREF} className={styles.cta}>
            Request Proposal
            <Image
              src="/images/arrows/arrow-right.svg"
              alt=""
              width={24}
              height={24}
              className={styles.ctaIcon}
            />
          </Link>
        </div>
      </div>
    </aside>
  );
}
