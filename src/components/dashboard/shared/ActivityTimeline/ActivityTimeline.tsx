import React from "react";
import Image from "next/image";
import styles from "./ActivityTimeline.module.scss";

export type MilestoneStatus = "completed" | "pending";

export interface Milestone {
  id: string;
  title: string;
  time?: string;
  description?: string;
  status: MilestoneStatus;
}

interface ActivityTimelineProps {
  title?: string;
  milestones: Milestone[];
}

export default function ActivityTimeline({ title = "Activity Timeline", milestones }: ActivityTimelineProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleIcon}>
          <Image
            src="/images/dashboard/inquiries/activity_timeline.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        {title}
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineLine} />
        {milestones.map((milestone) => (
          <div 
            key={milestone.id} 
            className={`${styles.milestone} ${milestone.status === "pending" ? styles.milestonePending : ""}`}
          >
            <div className={`${styles.iconWrapper} ${milestone.status === "completed" ? styles.iconCompleted : styles.iconPending}`}>
              {milestone.status === "completed" ? (
                <Image
                  src="/images/check-white.svg"
                  alt="Completed"
                  width={18}
                  height={18}
                />
              ) : (
                <div className={styles.dot} />
              )}
            </div>
            
            <div className={styles.milestoneContent}>
              <div className={styles.milestoneHeader}>
                <span className={styles.milestoneTitle}>{milestone.title}</span>
                <span className={styles.milestoneTime}>{milestone.time}</span>
              </div>
              {milestone.description && (
                <p className={styles.milestoneDesc}>{milestone.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
