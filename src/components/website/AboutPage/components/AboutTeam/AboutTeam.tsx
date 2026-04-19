import Image from "next/image";
import styles from "./AboutTeam.module.scss";

export default function AboutTeam() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Photos side */}
          <div className={styles.imagesGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.imageWrapSm}>
                <Image src="/images/team/team1.jpg" alt="Team meeting" fill className={styles.image} />
              </div>
              <div className={styles.imageWrapSm}>
                <Image src="/images/team/team2.jpg" alt="Team posing" fill className={styles.image} />
              </div>
            </div>
            <div className={styles.rightColumn}>
              <div className={styles.imageWrapLg}>
                <Image src="/images/team/team3.jpg" alt="Team working" fill className={styles.image} />
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className={styles.content}>
            <div className={styles.textGroup}>
              <span className={styles.label}>The Team</span>
              <h2 className={styles.heading}>Meet the Team Behind the Experience</h2>
            </div>

            <div className={styles.paragraphs}>
              <p>
                Behind every successful corporate event, executive retreat, and large-scale company program is a team that believes in precision, structure, and accountability.
              </p>
              <p>
                Our team brings together professionals with expertise in corporate travel planning, event management, logistics coordination, venue negotiation, hospitality partnerships, and on-site operations. Each member understands that in the corporate world, details are not optional — they define the outcome.
              </p>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>100%</span>
                <span className={styles.statDesc}>Dedicated Corporate Focus</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>15,000+</span>
                <span className={styles.statDesc}>Attendees Managed</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>8+ Years</span>
                <span className={styles.statDesc}>Industry Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
